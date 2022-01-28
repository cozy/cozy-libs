import MicroEE from 'microee'
import get from 'lodash/get'

import Realtime from 'cozy-realtime'
import flag from 'cozy-flags'
import { Q } from 'cozy-client'

import {
  fetchReusableAccount,
  saveAccount,
  ACCOUNTS_DOCTYPE
} from '../connections/accounts'
import clone from 'lodash/clone'
import {
  launchTrigger,
  prepareTriggerAccount,
  fetchTrigger,
  ensureTrigger
} from '../connections/triggers'
import { KonnectorJobError, getLauncher } from '../helpers/konnectors'
import { watchKonnectorJob } from '../models/konnector/KonnectorJobWatcher'
import logger from '../logger'
import { findKonnectorPolicy } from '../konnector-policies'
import { createOrUpdateCipher } from '../models/cipherUtils'
import assert from '../assert'
import * as accounts from '../helpers/accounts'
import * as triggersModel from '../helpers/triggers'
import sentryHub from '../sentry'
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
  JOB_EVENTS
} from './flowEvents'

const JOBS_DOCTYPE = 'io.cozy.jobs'

const eventToStatus = {
  [ERROR_EVENT]: ERRORED,
  [LOGIN_SUCCESS_EVENT]: LOGIN_SUCCESS,
  [SUCCESS_EVENT]: SUCCESS
}
const stepEvents = [LOGIN_SUCCESS_EVENT]
const isStepEvent = eventName => stepEvents.includes(eventName)

/**
 * Creates or updates an io.cozy.accounts from user submitted data
 * Used as a form submit handler
 *
 * @param  {io.cozy.account} options.account - Existing io.cozy.account or object
 * @param  {Cipher} options.cipher - Vault cipher if vault has been unlocked
 * @param  {CozyClient} options.client - A cozy client
 * @param  {io.cozy.konnector} options.konnector - Konnector to which the account is linked
 * @param  {KonnectorPolicy} options.konnectorPolicy - Controls if auth is saved in io.cozy.accounts
 * and if auth is saved into the vault
 * @param  {function} options.saveAccount
 * @param  {object} options.userCredentials
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
    logger.debug('Updating the account...')
  } else {
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
  constructor(client, trigger, konnector) {
    this.client = client
    this.trigger = trigger
    this.konnector = konnector
    this.unsubscribeAllRealtime = null

    // Bind methods used as callbacks
    this.getTwoFACodeProvider = this.getTwoFACodeProvider.bind(this)
    this.getKonnectorSlug = this.getKonnectorSlug.bind(this)
    this.handleAccountUpdated = this.handleAccountUpdated.bind(this)
    this.handleJobUpdated = this.handleJobUpdated.bind(this)
    this.handleAccountTwoFA = this.handleAccountTwoFA.bind(this)
    this.launch = this.launch.bind(this)
    this.sendTwoFACode = this.sendTwoFACode.bind(this)
    this.unwatch = this.unwatch.bind(this)

    this.state = {
      status: IDLE
    }

    // Stores data necessary for custom connection flow, for example
    // a budget-insight temporary token
    this.data = {}

    this.twoFAWaiters = this.twoFAWaiters || []

    this.realtime = new Realtime({ client })
  }

  getTwoFACodeProvider() {
    return accounts.getTwoFACodeProvider(this.account)
  }

  getKonnectorSlug() {
    return this.trigger.message.konnector
  }

  handleAccountTwoFA(prevAccount) {
    const account = this.account

    const prevState = prevAccount && prevAccount.state
    const state = account.state

    return this.handleTwoFAStateChange(state, prevState)
  }

  handleTwoFAStateChange(state, prevState = null) {
    if (prevState === state) {
      return
    }
    if (accounts.isTwoFANeeded(state)) {
      this.setState({ status: TWO_FA_REQUEST })
      this.emit(TWO_FA_REQUEST_EVENT)
    } else if (accounts.isTwoFARetry(state)) {
      this.setState({ status: TWO_FA_MISMATCH })
      this.emit(TWO_FA_MISMATCH_EVENT)
    }
  }

  triggerEvent(eventName, ...args) {
    logger.debug(`ConnectionFlow: triggerEvent ${eventName}`, args)
    if (isStepEvent(eventName)) {
      this.setState({ [eventName]: true })
    }
    if (eventToStatus[eventName]) {
      logger.debug(`ConnectionFlow: Setting status ${eventToStatus[eventName]}`)
      this.setState({ status: eventToStatus[eventName] })
    }
    if (eventName === ERROR_EVENT) {
      this.refetchTrigger()
    }
    this.emit(eventName, ...args)
  }

  getAccount() {
    return this.account
  }

  async saveTwoFARequest(twoFARequestOptions) {
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
   */
  waitForTwoFA() {
    logger.info('ConnectionFlow: Waiting for two FA')
    if (this.jobWatcher) {
      this.jobWatcher.disableSuccessTimer()
    }

    // eslint-disable-next-line promise/param-names
    return new Promise(rawResolve => {
      const accountId = this.account._id
      assert(accountId, 'Cannot wait for two fa on account without id')

      const resolve = () => {
        this.realtime.unsubscribe(
          'updated',
          ACCOUNTS_DOCTYPE,
          accountId,
          handleAccountUpdate
        )
        rawResolve()
      }

      const handleAccountUpdate = account => {
        if (account && account.twoFACode) {
          resolve()
        }
      }

      const updateFromCustomPolicy = () => {
        resolve()
      }

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
   * Saves and updates internal account
   */
  async saveAccount(updatedAccount) {
    logger.debug('ConnectionFlow: Saving account')
    this.account = await saveAccount(
      this.client,
      this.konnector,
      updatedAccount
    )
    logger.info('ConnectionFlow: Saved account')
    return this.account
  }

  flushTwoFAWaiters() {
    logger.debug(
      `ConnectionFlow: Flushing ${this.twoFAWaiters.length} two fa waiters`
    )
    for (const callback of this.twoFAWaiters) {
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
      logger.debug(`ConnectionFlow: Sending two fa code ${code}`)
      await this.saveAccount(accounts.updateTwoFaCode(this.account, code))
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error(error)
      this.setState({ status: ERRORED, error })
    }
  }

  handleLoginSuccess() {
    this.jobWatcher.handleSuccess()
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

      this.setState({ status: CREATING_ACCOUNT })
      this.trigger = trigger
      this.account = account
      this.konnector = konnector

      this.t = t

      assert(client, 'No client')
      const konnectorPolicy = findKonnectorPolicy(konnector)
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
        logger.info(
          'ConnectionFlow: Bypassing cipher creation because of konnector account policy'
        )
      }

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

      logger.info(`ConnectionFlow: Saved account ${account._id}`)

      await this.ensureTriggerAndLaunch(client, {
        trigger,
        account,
        konnector,
        t
      })
      this.setState({ accountError: null })
    } catch (e) {
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

  async handleJobUpdated() {
    logger.debug('ConnectionFlow: Handling update from job')
    await this.refetchTrigger()
  }

  async refetchTrigger() {
    if (!this.trigger) {
      return null
    }
    logger.debug(`ConnectionFlow: Refetching trigger  ${this.trigger._id}`)
    const trigger = await fetchTrigger(this.client, this.trigger._id)
    logger.debug(`Refetched trigger`, trigger)
    this.trigger = trigger
    this.emit(UPDATE_EVENT)
  }

  async ensureTriggerAndLaunch(client, { trigger, account, konnector, t }) {
    logger.debug('ConnectionFlow: Ensuring trigger...')
    this.t = t
    const ensuredTrigger = await ensureTrigger(client, {
      trigger,
      account,
      konnector,
      t
    })

    await this.addDefaultFolderPath(client, {
      trigger: ensuredTrigger,
      account,
      konnector
    })

    logger.info(`Trigger is ${ensuredTrigger._id}`)
    this.trigger = ensuredTrigger
    this.emit(UPDATE_EVENT)
    await this.launch()
  }

  /**
   * Add a default folder path to the account if any folder is needed by the connector
   * and/or the account does not have it yet.
   * The account is saved if any change is done to it.
   * This defaultFolderPath is needed by the stack to recreate the destination folder.
   * had beed removed by any mean : drive application, desktop application etc
   *
   * @param  {CozyClient} client - A cozy client
   * @param  {io.cozy.triggers} options.trigger
   * @param  {io.cozy.accounts} options.account
   * @param  {io.cozy.konnector} options.konnector
   */
  async addDefaultFolderPath(client, { trigger, account, konnector }) {
    const folderId = get(trigger, 'message.folder_to_save')
    if (folderId && !account.defaultFolderPath) {
      const { data: folder } = await client.query(
        Q('io.cozy.files').getById(folderId)
      )
      account.defaultFolderPath = folder.path
      await saveAccount(client, konnector, account)
    }
  }

  /**
   * Launches the job and sets everything up to follow execution.
   */
  async launch({ autoSuccessTimer = true } = {}) {
    const computedAutoSuccessTimer =
      autoSuccessTimer && !get(this, 'konnector.clientSide')

    logger.info('ConnectionFlow: Launching job...')
    this.setState({ status: PENDING })

    this.account = await prepareTriggerAccount(this.client, this.trigger)
    this.realtime.subscribe(
      'updated',
      ACCOUNTS_DOCTYPE,
      this.account._id,
      this.handleAccountUpdated
    )
    logger.info(
      `ConnectionFlow: Subscribed to ${ACCOUNTS_DOCTYPE}:${this.account._id}`
    )

    this.job = await launchTrigger(this.client, this.trigger)

    if (get(this, 'konnector.clientSide')) {
      logger.info(
        'This connector can be run by the launcher',
        this.konnector.slug
      )
      const launcher = getLauncher({ win: window })
      if (launcher) {
        logger.info('Found a launcher', launcher)
      }
      if (launcher === 'react-native') {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: 'startLauncher',
            value: {
              connector: this.konnector,
              account: this.account,
              trigger: this.trigger,
              job: this.job
            }
          })
        )
      } else {
        logger.info('Found no client connector launcher')
      }
    }

    this.realtime.subscribe(
      'updated',
      JOBS_DOCTYPE,
      this.job._id,
      this.handleJobUpdated.bind(this)
    )
    this.jobWatcher = watchKonnectorJob(this.client, this.job, {
      autoSuccessTimer: computedAutoSuccessTimer
    })
    logger.info(`ConnectionFlow: Subscribed to ${JOBS_DOCTYPE}:${this.job._id}`)

    for (const ev of JOB_EVENTS) {
      this.jobWatcher.on(ev, (...args) => this.triggerEvent(ev, ...args))
    }

    this.unsubscribeAllRealtime = () => {
      this.jobWatcher.unsubscribeAll()
      this.realtime.unsubscribeAll()
    }
  }

  unwatch() {
    if (typeof this.unsubscribeAllRealtime === 'function') {
      this.unsubscribeAllRealtime()
    }
  }

  reset() {
    this.trigger = null
    this.job = null
    this.emit(UPDATE_EVENT)
  }

  getMockError() {
    return flag('harvest.force-last-error')
      ? new KonnectorJobError(flag('harvest.force-last-error'))
      : null
  }

  getDerivedState() {
    const trigger = this.trigger
    const { status, accountError } = this.state
    const triggerError = triggersModel.getKonnectorJobError(trigger)
    return {
      running: ![ERRORED, IDLE, SUCCESS].includes(status),
      twoFARunning: status === RUNNING_TWOFA,
      twoFARetry: status == TWO_FA_MISMATCH,
      triggerError: triggerError,
      trigger,
      accountError,
      error: this.getMockError() || accountError || triggerError,
      konnectorRunning: triggersModel.isKonnectorRunning(trigger)
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
