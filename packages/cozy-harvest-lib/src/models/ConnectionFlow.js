// @ts-check
// @ts-ignore
import clone from 'lodash/clone'
import MicroEE from 'microee'

// @ts-ignore
import { Q } from 'cozy-client'
import flag from 'cozy-flags'

import {
  ERRORED,
  ERROR_EVENT,
  LOGIN_SUCCESS,
  LOGIN_SUCCESS_EVENT,
  SUCCESS,
  SUCCESS_EVENT,
  IDLE,
  UPDATE_EVENT,
  RUNNING_TWOFA,
  TWO_FA_REQUEST,
  TWO_FA_REQUEST_EVENT,
  TWO_FA_MISMATCH,
  TWO_FA_MISMATCH_EVENT,
  WAITING_TWOFA,
  CREATING_ACCOUNT,
  PENDING,
  JOB_EVENTS,
  EXPECTING_TRIGGER_LAUNCH
} from './flowEvents'
import assert from '../assert'
import {
  fetchReusableAccount,
  saveAccount,
  ACCOUNTS_DOCTYPE
} from '../connections/accounts'
import {
  launchTrigger,
  prepareTriggerAccount,
  fetchTrigger,
  ensureTrigger
} from '../connections/triggers'
import * as accounts from '../helpers/accounts'
import { KonnectorJobError } from '../helpers/konnectors'
import * as triggersModel from '../helpers/triggers'
import { findKonnectorPolicy } from '../konnector-policies'
import logger from '../logger'
import { createOrUpdateCipher } from '../models/cipherUtils'
import { watchKonnectorJob } from '../models/konnector/KonnectorJobWatcher'
import sentryHub from '../sentry'
import { sendRealtimeNotification } from '../services/jobUtils'
import '../types'

const JOBS_DOCTYPE = 'io.cozy.jobs'

const eventToStatus = {
  [ERROR_EVENT]: ERRORED,
  [LOGIN_SUCCESS_EVENT]: LOGIN_SUCCESS,
  [SUCCESS_EVENT]: SUCCESS
}
const stepEvents = [LOGIN_SUCCESS_EVENT]
/**
 * Get if the given event is a step event
 *
 * @param {String} eventName
 * @returns {Boolean}
 */
const isStepEvent = eventName => stepEvents.includes(eventName)

/**
 * Creates or updates an io.cozy.accounts from user submitted data
 * Used as a form submit handler
 *
 * @param  {Object} options
 * @param  {import('cozy-client/types/types').IOCozyAccount} options.account - Existing io.cozy.account or object
 * @param  {Object} [options.cipher] - Vault cipher if vault has been unlocked
 * @param  {String} [options.cipher.id] - Vault cipher id
 * @param  {ConnectionFlow} options.flow - Current connection flow
 * @param  {CozyClient} options.client - A CozyClient instance
 * @param  {import('cozy-client/types/types').IOCozyKonnector} options.konnector - Konnector to which the account is linked
 * @param  {KonnectorPolicy} options.konnectorPolicy - Controls if auth is saved in io.cozy.accounts and if auth is saved into the vault
 * @param  {Object} options.userCredentials
 */
export const createOrUpdateAccount = async ({
  account,
  cipher,
  client,
  flow,
  konnector,
  konnectorPolicy,
  userCredentials
}) => {
  assert(flow, 'No flow')
  const isUpdate = !!account

  if (isUpdate) {
    // @ts-ignore
    logger.debug('Updating the account...')
  } else {
    // @ts-ignore
    logger.debug('Creating the account...')
  }

  const { onAccountCreation, saveInVault } = konnectorPolicy

  let accountToSave = clone(account) || {}

  accountToSave = accounts.resetState(accountToSave)

  accountToSave = accounts.setSessionResetIfNecessary(
    accountToSave,
    userCredentials
  )

  if (isUpdate) {
    accountToSave = accounts.mergeAuth(accountToSave, userCredentials)
  } else {
    const recycableAccount = await fetchReusableAccount(client, konnector)
    if (recycableAccount) {
      accountToSave = accounts.mergeAuth(recycableAccount, userCredentials)
    } else {
      accountToSave = accounts.build(konnector, userCredentials)
    }
  }

  if (onAccountCreation) {
    // @ts-ignore
    logger.debug(
      `Using ${konnectorPolicy.name} konnector policy custom account creation`
    )
    accountToSave = await onAccountCreation({
      client,
      flow,
      account: accountToSave,
      konnector
    })
  }

  if (cipher && saveInVault) {
    accountToSave = accounts.setVaultCipherRelationship(
      accountToSave,
      cipher.id
    )
  } else {
    // @ts-ignore
    logger.warn(
      'No cipher passed when creating/updating account, account will not be linked to cipher'
    )
  }
  return await saveAccount(client, konnector, accountToSave)
}

/**
 * Event hub to launch and follow a konnector job.
 *
 * - Creates the job for a trigger
 * - Listens to changes on
 *   - the created job
 *   - the account linked to the trigger
 *
 * Transforms low-level events happening on the documents to higher-level events
 * closer to business logic.
 *
 * This should be the go to source of truth for the state of a Konnector Job.
 */
export class ConnectionFlow {
  /**
   * Constructor
   *
   * @param {CozyClient} client - CozyClient instance
   * @param {import('cozy-client/types/types').IOCozyTrigger} trigger - io.cozy.triggers object
   * @param {import('cozy-client/types/types').IOCozyKonnector} konnector - io.cozy.konnectors object
   */
  constructor(client, trigger, konnector) {
    this.client = client
    this.trigger = trigger
    this.konnector = konnector
    this.unsubscribeAllRealtime = null

    // Bind methods used as callbacks
    this.getTwoFACodeProvider = this.getTwoFACodeProvider.bind(this)
    this.getKonnectorSlug = this.getKonnectorSlug.bind(this)
    this.handleAccountUpdated = this.handleAccountUpdated.bind(this)
    this.handleCurrentJobUpdated = this.handleCurrentJobUpdated.bind(this)
    this.handleTriggerJobUpdated = this.handleTriggerJobUpdated.bind(this)
    this.handleTriggerDeleted = this.handleTriggerDeleted.bind(this)
    this.handleTriggerCreated = this.handleTriggerCreated.bind(this)
    this.handleAccountTwoFA = this.handleAccountTwoFA.bind(this)
    this.launch = this.launch.bind(this)
    this.sendTwoFACode = this.sendTwoFACode.bind(this)
    this.unwatch = this.unwatch.bind(this)

    this.state = {
      status: IDLE,
      accountError: null,
      firstRun: false
    }

    // Stores data necessary for custom connection flow, for example
    // a budget-insight temporary token
    this.data = {}

    this.twoFAWaiters = this.twoFAWaiters || []

    this.realtime = client.plugins.realtime

    this.watchCurrentJobIfTriggerIsAlreadyRunning()
    this.watchTriggerJobs()
    this.watchTriggers()
  }

  getTwoFACodeProvider() {
    return accounts.getTwoFACodeProvider(this.account)
  }

  getKonnectorSlug() {
    return this.trigger.message.konnector
  }

  /**
   * Handle 2FA
   *
   * @param {import('cozy-client/types/types').IOCozyAccount} prevAccount - previous state of the account
   * @returns {void}
   */
  handleAccountTwoFA(prevAccount) {
    const account = this.account

    const prevState = prevAccount && prevAccount.state
    const state = account.state

    return this.handleTwoFAStateChange(state, prevState)
  }

  /**
   * Adapt the ConnectionFlow status according to the current and previous state
   *
   * @param {String} state - current state
   * @param {String|null} prevState - previous state
   * @returns {void}
   */
  handleTwoFAStateChange(state, prevState = null) {
    if (prevState === state) {
      return
    }
    if (accounts.isTwoFANeeded(state)) {
      this.setState({ status: TWO_FA_REQUEST })
      // @ts-ignore
      this.emit(TWO_FA_REQUEST_EVENT)
    } else if (accounts.isTwoFARetry(state)) {
      this.setState({ status: TWO_FA_MISMATCH })
      // @ts-ignore
      this.emit(TWO_FA_MISMATCH_EVENT)
    }
  }

  triggerEvent(eventName, ...args) {
    // @ts-ignore
    logger.debug(`ConnectionFlow: triggerEvent ${eventName}`, args)
    if (isStepEvent(eventName)) {
      this.setState({ [eventName]: true })
    }
    if (eventToStatus[eventName]) {
      // @ts-ignore
      logger.debug(`ConnectionFlow: Setting status ${eventToStatus[eventName]}`)
      this.setState({ status: eventToStatus[eventName] })
    }
    if (eventName === ERROR_EVENT) {
      this.setState({ accountError: args[0] })
      this.refetchTrigger()
    }
    // @ts-ignore
    this.emit(eventName, ...args)
  }

  getAccount() {
    return this.account
  }

  async saveTwoFARequest(twoFARequestOptions) {
    // @ts-ignore
    logger.debug('Saving 2FA request', twoFARequestOptions)
    this.setState({ status: WAITING_TWOFA })
    try {
      const account = accounts.updateTwoFAState(
        this.account,
        twoFARequestOptions
      )
      await this.saveAccount(account)
      this.triggerEvent(TWO_FA_REQUEST_EVENT, twoFARequestOptions)
    } catch (error) {
      // @ts-ignore
      logger.error(error)
      this.setState({ status: ERRORED, error })
    }
  }

  /**
   * Waits until two fa code has been sent
   *
   * - Monitors the account (for the case where the 2FA code is filled by the konnector job)
   * - Subscribes a "manual" waiter for when the 2FA is done completely in-browser (budget-insight
   *   for example)
   *
   * @returns {Promise<void>}
   */
  waitForTwoFA() {
    // @ts-ignore
    logger.info('ConnectionFlow: Waiting for two FA')
    if (this.jobWatcher) {
      this.jobWatcher.disableSuccessTimer()
    }

    return new Promise(resolve => {
      const accountId = this.account._id
      assert(accountId, 'Cannot wait for two fa on account without id')
      const resolveWithUnsubscribe = () => {
        this.realtime.unsubscribe(
          'updated',
          ACCOUNTS_DOCTYPE,
          accountId,
          handleAccountUpdate
        )
        resolve()
      }

      const handleAccountUpdate = account => {
        if (account && account.twoFACode) {
          resolveWithUnsubscribe()
        }
      }

      const updateFromCustomPolicy = () => {
        resolveWithUnsubscribe()
      }
      // @ts-ignore l'argument de type () => void n'est pas attribuable au paramètre de type 'never'
      this.twoFAWaiters.push(updateFromCustomPolicy)

      this.realtime.subscribe(
        'updated',
        ACCOUNTS_DOCTYPE,
        accountId,
        handleAccountUpdate
      )
    })
  }

  /**
   * Set a state to the flow to show that the current trigger is running while the job is not
   * created yet (the job will be created by a webhook)
   *
   * @param {Object} options
   * @param {import('cozy-client/types/types').KonnectorsDoctype} options.konnector
   */
  expectTriggerLaunch() {
    // @ts-ignore
    logger.info(
      `ConnectionFlow: Expecting trigger launch for konnector ${this.konnector.slug}`
    )

    sendRealtimeNotification({
      client: this.client,
      data: { slug: this.konnector.slug }
    })

    this.setState({ status: EXPECTING_TRIGGER_LAUNCH, accountError: null })

    /**
     * Watch a newly created job
     *
     * @param {IoCozyJob} job - job document
     * @returns void
     */
    const handleTriggerLaunch = job => {
      if (
        job.worker !== 'konnector' ||
        job.message.konnector !== this.konnector.slug
      )
        return

      this.realtime.unsubscribe('created', JOBS_DOCTYPE, handleTriggerLaunch)
      this.job = job
      this.watchJob({ autoSuccessTimer: false })
    }
    this.realtime.subscribe('created', JOBS_DOCTYPE, handleTriggerLaunch)
  }

  /**
   * Saves and updates internal account
   *
   * @param {import('cozy-client/types/types').IOCozyAccount} updatedAccount - updated account
   * @returns {import('cozy-client/types/types').IOCozyAccount}
   */
  async saveAccount(updatedAccount) {
    // @ts-ignore
    logger.debug('ConnectionFlow: Saving account')
    this.account = await saveAccount(
      this.client,
      this.konnector,
      updatedAccount
    )
    // @ts-ignore
    logger.info('ConnectionFlow: Saved account')
    return this.account
  }

  flushTwoFAWaiters() {
    // @ts-ignore
    logger.debug(
      `ConnectionFlow: Flushing ${this.twoFAWaiters.length} two fa waiters`
    )
    for (const callback of this.twoFAWaiters) {
      // @ts-ignore l'argument de type never n'a aucune signature d'appel
      callback()
    }
    this.twoFAWaiters = []
  }

  async sendAdditionalInformation(fields) {
    this.setState({ status: RUNNING_TWOFA })
    try {
      const konnectorPolicy = this.getKonnectorPolicy()
      await konnectorPolicy.sendAdditionalInformation(this, fields)
      this.flushTwoFAWaiters()
    } catch (error) {
      // @ts-ignore
      logger.error(error)
      this.setState({ status: ERRORED, error })
    }
  }

  /**
   * "Sends" 2FA Code
   */
  async sendTwoFACode(code) {
    this.setState({ status: RUNNING_TWOFA })
    try {
      // @ts-ignore
      logger.debug(`ConnectionFlow: Sending two fa code ${code}`)
      await this.saveAccount(accounts.updateTwoFaCode(this.account, code))
    } catch (error) {
      // eslint-disable-next-line no-console
      // @ts-ignore
      logger.error(error)
      this.setState({ status: ERRORED, error })
    }
  }

  handleLoginSuccess() {
    this.jobWatcher.handleLoginSuccess()
    this.triggerEvent(LOGIN_SUCCESS_EVENT)
  }

  handleLoginSuccessHandled() {
    this.jobWatcher.disableSuccessTimer()
  }

  /**
   * - Creates io.cozy.accounts
   * - Links cipher to account
   * - Saves account
   * - Ensures trigger is existing for account
   * - Finds cipher via identifier / password
   * - Ensures a cipher is created if vault is unlocked
   * - Launches konnector job
   */
  async handleFormSubmit(options) {
    const { konnector, cipherId, vaultClient, userCredentials, t } = options
    try {
      let { account, trigger } = options

      const client = this.client

      this.setState({
        status: CREATING_ACCOUNT,
        firstRun: true // when the user submits new authentication information, this is considered a first run
      })
      this.trigger = trigger
      this.account = account

      this.t = t

      assert(client, 'No client')
      const konnectorPolicy = this.getKonnectorPolicy()
      // @ts-ignore
      logger.log(
        `ConnectionFlow: Handling submit, with konnector policy ${konnectorPolicy.name}`
      )

      let cipher
      if (konnectorPolicy.saveInVault) {
        cipher = await createOrUpdateCipher(vaultClient, cipherId, {
          account,
          konnector,
          userCredentials
        })
      } else {
        // @ts-ignore
        logger.info(
          'ConnectionFlow: Bypassing cipher creation because of konnector account policy'
        )
      }

      if (konnectorPolicy.needsAccountAndTriggerCreation) {
        // @ts-ignore
        logger.debug('ConnectionFlow: Creating/updating account...', account)
        account = await createOrUpdateAccount({
          account,
          cipher,
          client,
          flow: this,
          konnector,
          konnectorPolicy,
          userCredentials
        })

        this.account = account

        // @ts-ignore
        logger.info(`ConnectionFlow: Saved account ${account._id}`)

        await this.ensureTriggerAndLaunch(client, {
          trigger,
          account,
          konnector,
          t
        })
      } else {
        await this.launch()
      }

      this.setState({ accountError: null })
    } catch (e) {
      // @ts-ignore
      logger.error(e)
      this.setState({ accountError: e })
      this.triggerEvent(ERROR_EVENT, e)
      sentryHub.withScope(scope => {
        scope.setTag('konnector', konnector.slug)

        // Capture the original exception instead of the user one
        sentryHub.captureException(e.original || e)
      })
      throw e
    }
  }

  /**
   * - Creates io.cozy.accounts
   * - Saves account
   * - Ensures trigger is existing for account
   */
  async createAccountSilently(options) {
    const { konnector, userCredentials, t } = options
    try {
      let { account, trigger } = options

      const client = this.client

      this.setState({
        status: CREATING_ACCOUNT,
        firstRun: true // when the user submits new authentication information, this is considered a first run
      })
      this.trigger = trigger
      this.account = account

      this.t = t

      assert(client, 'No client')
      const konnectorPolicy = this.getKonnectorPolicy()
      // @ts-ignore
      logger.log(
        `ConnectionFlow: Handling submit, with konnector policy ${konnectorPolicy.name}`
      )

      // @ts-ignore
      logger.info(
        'ConnectionFlow: Bypassing cipher creation because of vault may be unlocked'
      )

      if (konnectorPolicy.needsAccountAndTriggerCreation) {
        // @ts-ignore
        logger.debug('ConnectionFlow: Creating/updating account...', account)
        account = await createOrUpdateAccount({
          account,
          client,
          flow: this,
          konnector,
          konnectorPolicy,
          userCredentials
        })

        this.account = account

        // @ts-ignore
        logger.info(`ConnectionFlow: Saved account ${account._id}`)

        // @ts-ignore
        logger.debug('ConnectionFlow: Ensuring trigger...')
        this.trigger = await ensureTrigger(client, {
          trigger,
          account,
          konnector,
          t
        })
        // @ts-ignore
        logger.info(`Trigger is ${this.trigger._id}`)
      }

      this.setState({ accountError: null })
    } catch (e) {
      // @ts-ignore
      logger.error(e)
      this.setState({ accountError: e })
      this.triggerEvent(ERROR_EVENT, e)
      sentryHub.withScope(scope => {
        scope.setTag('konnector', konnector.slug)

        // Capture the original exception instead of the user one
        sentryHub.captureException(e.original || e)
      })
      throw e
    }
  }

  /**
   * Ensures a trigger is created and launched
   *
   * @param {CozyClient} client - CozyClient instance
   * @param {object} options - options object
   * @param {import('cozy-client/types/types').IOCozyAccount} options.account - cozy account
   * @param {import('cozy-client/types/types').IOCozyKonnector} options.konnector - cozy konnector
   * @param {import('cozy-client/types/types').IOCozyTrigger} options.trigger - cozy trigger
   * @param {Function} options.t - localization function
   * @returns {Promise<void>}
   */
  async ensureTriggerAndLaunch(client, { account, konnector, trigger, t }) {
    // @ts-ignore
    logger.debug('ConnectionFlow: Ensuring trigger...')
    this.trigger = await ensureTrigger(client, {
      trigger,
      account,
      konnector,
      t
    })
    // @ts-ignore
    logger.info(`Trigger is ${this.trigger._id}`)

    await this.ensureDefaultFolderPathInAccount(client, {
      trigger: this.trigger,
      account,
      konnector
    })

    // @ts-ignore
    this.emit(UPDATE_EVENT)
    await this.launch()
  }

  handleTriggerCreated(trigger) {
    if (
      this.konnector.slug !== trigger?.message?.konnector ||
      this.trigger !== null
    ) {
      return // filter out trigger associated to konnector or if a current trigger already exists
    }

    this.trigger = trigger
    // @ts-ignore
    this.emit(UPDATE_EVENT)
  }

  handleTriggerDeleted(trigger) {
    if (this.trigger?._id !== trigger?._id) return // filter out trigger associated to current trigger

    this.reset()
    // @ts-ignore
    this.emit(UPDATE_EVENT)
  }

  handleAccountUpdated(account) {
    const prevAccount = this.account

    // _type is not present in objects from realtime but we have to keep
    // it to be compatible with cozy-client's methods
    //
    this.account = {
      _type: prevAccount._type,
      ...account
    }
    const { state } = this.account
    if (accounts.isTwoFANeeded(state) || accounts.isTwoFARetry(state)) {
      this.handleAccountTwoFA(prevAccount)
    } else if (accounts.isLoginSuccessHandled(state)) {
      this.handleLoginSuccessHandled()
    } else if (accounts.isLoginSuccess(state)) {
      this.handleLoginSuccess()
    }
  }

  handleCurrentJobUpdated() {
    // @ts-ignore
    logger.debug('ConnectionFlow: Handling update from job')
    this.refetchTrigger()
  }

  /**
   * Will update the current trigger if a new job related to the current trigger is updated
   *
   * @param {IoCozyJob} job
   */
  handleTriggerJobUpdated(job) {
    if (job.trigger_id !== this.trigger?._id) return // filter out jobs associated to other triggers
    if (job._id === this.job?._id) return // if the event is associated to a job we are already watching, ignore it. No need to refetch the current trigger in this case

    this.refetchTrigger()
  }

  /**
   * Fetch the current trigger from the database and watch it
   */
  async refetchTrigger() {
    if (!this.trigger) {
      return null
    }
    // @ts-ignore
    logger.debug(`ConnectionFlow: Refetching trigger  ${this.trigger._id}`)
    const trigger = await fetchTrigger(this.client, this.trigger._id)
    // @ts-ignore
    logger.debug(`Refetched trigger`, trigger)
    this.trigger = trigger

    this.watchCurrentJobIfTriggerIsAlreadyRunning()

    // @ts-ignore
    this.emit(UPDATE_EVENT)
  }

  /**
   * Ensures there is a defaultFolderPath attribute in the account
   * if any folder is needed by the connector.
   * The account is saved if any change is done to it.
   * This defaultFolderPath is needed by the stack to recreate the
   * destination folder if removed by any mean : drive application,
   * desktop application etc
   *
   * @param  {CozyClient} client - A cozy client instance
   * @param  {Object} options
   * @param  {import('cozy-client/types/types').TriggersDoctype} options.trigger
   * @param  {import('cozy-client/types/types').IOCozyAccount} options.account
   * @param  {import('cozy-client/types/types').KonnectorsDoctype} options.konnector
   */
  async ensureDefaultFolderPathInAccount(
    client,
    { trigger, account, konnector }
  ) {
    // @ts-ignore the message property does not exist in TriggersDoctype
    const folderId = trigger?.message?.folder_to_save
    if (!folderId) {
      return account
    }

    let folder
    try {
      const result = await client.query(Q('io.cozy.files').getById(folderId))
      folder = result.data
      if (folder.path !== account.defaultFolderPath) {
        account.defaultFolderPath = folder.path
        const savedAccount = await saveAccount(client, konnector, account)
        return savedAccount
      }
    } catch (err) {
      // @ts-ignore
      logger.warn(
        `ConnectionFlow.ensureDefaultFolderPath: folder ${folderId} does not exist. Could not ensure defaultFolderPath. ${err.message}`
      )
    }
    return account
  }

  /**
   * Tell if the error is an error which needs an action from the user
   *
   * @param {Error} error - error object
   * @returns {boolean}
   */
  isUserActionError(error) {
    if (!error) return false

    const userErrors = ['USER_ACTION_NEEDED', 'LOGIN_FAILED']
    return userErrors.some(userError => error.message.includes(userError))
  }

  /**
   * Launches the job and sets everything up to follow execution.
   */
  async launch({ autoSuccessTimer = true } = {}) {
    const { error } = this.getState()

    if (this.isUserActionError(error)) {
      // accounts with user actionnable errors are considered as the first run.
      // this will especially allow to show the backdrop effect to tell the user to stay until the login is successful
      this.setState({ firstRun: true })
    }
    const konnectorPolicy = this.getKonnectorPolicy()

    const computedAutoSuccessTimer = autoSuccessTimer

    // @ts-ignore
    logger.info('ConnectionFlow: Launching job...')
    this.setState({
      status: PENDING,
      accountError: null
    })

    if (this.trigger) {
      this.account = await prepareTriggerAccount(this.client, this.trigger)
    }
    if (konnectorPolicy.onLaunch) {
      konnectorPolicy
        .onLaunch({
          konnector: this.konnector,
          trigger: this.trigger,
          account: this.account,
          flow: this
        })
        .then(() => this.setState({ status: IDLE }))
        .catch(err =>
          // @ts-ignore
          logger.error(`Error while launching policy : ${err.message}`)
        )
    }
    if (!konnectorPolicy.needsTriggerLaunch) {
      return
    }
    this.realtime.subscribe(
      'updated',
      ACCOUNTS_DOCTYPE,
      this.account._id,
      this.handleAccountUpdated
    )
    // @ts-ignore
    logger.info(
      `ConnectionFlow: Subscribed to ${ACCOUNTS_DOCTYPE}:${this.account._id}`
    )

    this.job = await launchTrigger(this.client, this.trigger)
    this.watchJob({ autoSuccessTimer: computedAutoSuccessTimer })
  }

  /**
   * If the trigger we display is already running, subscribe to the associated job
   */
  watchCurrentJobIfTriggerIsAlreadyRunning() {
    if (this.trigger?.current_state?.status === 'running') {
      this.job = {
        _id: this.trigger?.current_state?.last_executed_job_id
      }
      this.watchJob({ autoSuccessTimer: false, loginSuccess: true })
    }
  }

  /**
   * Watch all triggers
   */
  watchTriggers() {
    this.realtime.subscribe(
      'deleted',
      'io.cozy.triggers',
      this.handleTriggerDeleted
    )
    this.realtime.subscribe(
      'created',
      'io.cozy.triggers',
      this.handleTriggerCreated
    )
  }

  /**
   * Watch all jobs related to the current trigger
   */
  watchTriggerJobs() {
    if (this.trigger) {
      if (
        !this.trigger?.current_state || // When the trigger comes from realtime, cozy-stack does not add the current_state to the object. So we need to request the stack to get it
        this.trigger.current_state.status === 'running' // ConnectionFlow could miss end of trigger job execution while reloading. We force refetch in this case
      ) {
        this.refetchTrigger()
      }
      this.realtime.subscribe(
        'updated',
        JOBS_DOCTYPE,
        this.handleTriggerJobUpdated
      )
    }
  }

  /**
   * Watches updates of the job given in this.job using watchKonnectorJob
   *
   * @param {Object} options
   * @param {Boolean} [options.autoSuccessTimer] - if true, suppose the login is sucessfull after 8 seconds
   * @param {Boolean} [options.loginSuccess] - if true, automatically add LOGIN_SUCCESS state to the flow
   * @returns {void}
   */
  watchJob(options = { autoSuccessTimer: false, loginSuccess: false }) {
    if (this.job?._id === this.jobWatcher?.job?._id) {
      // no need to rewatch a job we are already watching
      return
    }
    if (this.jobWatcher) {
      // if no job has been watched yet, there is not jobWatcher yet.
      this.jobWatcher.unsubscribeAll()
    }
    this.realtime.subscribe(
      'updated',
      JOBS_DOCTYPE,
      this.job._id,
      this.handleCurrentJobUpdated
    )
    this.jobWatcher = watchKonnectorJob(this.client, this.job, options)
    // @ts-ignore
    logger.info(`ConnectionFlow: Subscribed to ${JOBS_DOCTYPE}:${this.job._id}`)

    for (const ev of JOB_EVENTS) {
      this.jobWatcher.on(ev, (...args) => this.triggerEvent(ev, ...args))
    }
    if (options.loginSuccess) {
      this.handleLoginSuccess()
    }

    this.unsubscribeAllRealtime = () => {
      this.jobWatcher.unsubscribeAll()
      this.unsubscribeAllConnectionFlowRealtime()
    }
  }

  unsubscribeAllConnectionFlowRealtime() {
    this.realtime.unsubscribe(
      'updated',
      JOBS_DOCTYPE,
      this.handleTriggerJobUpdated
    )

    this.realtime.unsubscribe(
      'updated',
      JOBS_DOCTYPE,
      this.job._id,
      this.handleCurrentJobUpdated
    )
    this.realtime.unsubscribe(
      'deleted',
      'io.cozy.triggers',
      this.handleTriggerDeleted
    )
    this.realtime.unsubscribe(
      'created',
      'io.cozy.triggers',
      this.handleTriggerCreated
    )
  }

  unwatch() {
    if (typeof this.unsubscribeAllRealtime === 'function') {
      this.unsubscribeAllRealtime()
    }
  }

  reset() {
    this.trigger = null
    this.job = null
    // @ts-ignore
    this.emit(UPDATE_EVENT)
  }

  getMockError() {
    return flag('harvest.force-last-error')
      ? new KonnectorJobError(flag('harvest.force-last-error'))
      : null
  }

  getDerivedState() {
    const trigger = this.trigger
    const { status, accountError, firstRun } = this.state
    const triggerError = triggersModel.getKonnectorJobError(trigger)
    const running =
      trigger?.current_state?.status === 'running' ||
      ![ERRORED, IDLE, SUCCESS].includes(status)
    const konnectorPolicy = this.getKonnectorPolicy()
    const expectingTriggerLaunch = status === EXPECTING_TRIGGER_LAUNCH
    const error =
      !running &&
      !expectingTriggerLaunch &&
      (this.getMockError() || accountError || triggerError)
    const userNeeded =
      running &&
      !this.state[LOGIN_SUCCESS_EVENT] &&
      (konnectorPolicy.name === 'clisk' || firstRun)

    return {
      running,
      twoFARunning: status === RUNNING_TWOFA,
      twoFARetry: status == TWO_FA_MISMATCH,
      triggerError: triggerError,
      trigger,
      accountError,
      error,
      konnectorRunning: triggersModel.isKonnectorRunning(trigger),
      expectingTriggerLaunch,
      userNeeded
    }
  }

  getState() {
    return {
      ...this.state,
      ...this.getDerivedState()
    }
  }

  setState(update) {
    this.state = { ...this.state, ...update }
    // @ts-ignore
    this.emit(UPDATE_EVENT)
  }

  setData(update) {
    this.data = { ...this.data, ...update }
  }

  getData() {
    return this.data
  }

  getKonnectorPolicy() {
    return findKonnectorPolicy(this.konnector)
  }

  getAdditionalInformationNeeded() {
    const konnectorPolicy = this.getKonnectorPolicy()
    if (!konnectorPolicy) {
      throw new Error(
        'A konnector policy is needed to be able to detect additional information'
      )
    } else if (!konnectorPolicy.getAdditionalInformationNeeded) {
      throw new Error('No getAdditionalInformationNeeded in konnector policy')
    } else {
      const fields = konnectorPolicy.getAdditionalInformationNeeded(this)
      return fields
    }
  }
}

MicroEE.mixin(ConnectionFlow)

export default ConnectionFlow
