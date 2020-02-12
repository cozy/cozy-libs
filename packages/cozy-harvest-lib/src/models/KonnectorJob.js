import MicroEE from 'microee'

import Realtime from 'cozy-realtime'

import {
  saveAccount,
  ACCOUNTS_DOCTYPE
} from '../connections/accounts'
import clone from 'lodash/clone'
import { launchTrigger, prepareTriggerAccount } from '../connections/triggers'
import { watchKonnectorJob } from '../models/konnector/KonnectorJobWatcher'
import logger from '../logger'
import { findKonnectorPolicy } from '../konnector-policies'
import { createOrUpdateCipher } from '../models/cipherUtils'
import { fetchTrigger, ensureTrigger } from '../connections/triggers'
import assert from '../assert'
import * as accounts from '../helpers/accounts'
import * as triggersModel from '../helpers/triggers'

const JOBS_DOCTYPE = 'io.cozy.jobs'

// events
export const ERROR_EVENT = 'error'
export const LOGIN_SUCCESS_EVENT = 'loginSuccess'
export const SUCCESS_EVENT = 'success'
export const TRIGGER_LAUNCH_EVENT = 'TRIGGER_LAUNCH_EVENT'

export const TWO_FA_REQUEST_EVENT = 'twoFARequest'
export const TWO_FA_MISMATCH_EVENT = 'twoFAMismatch'
export const UPDATE_EVENT = 'update'

// statuses
export const IDLE = 'IDLE'
export const CREATING_ACCOUNT = 'CREATING_ACCOUNT'
export const PENDING = 'PENDING'
export const ERRORED = 'ERRORED'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const SUCCESS = 'SUCCESS'
export const RUNNING_TWOFA = 'RUNNING_TWOFA'
export const WAITING_TWOFA = 'WAITING_TWOFA'
export const TWO_FA_MISMATCH = 'TWO_FA_MISMATCH'
export const TWO_FA_REQUEST = 'TWO_FA_REQUEST'

const JOB_EVENTS = [ERROR_EVENT, LOGIN_SUCCESS_EVENT, SUCCESS_EVENT]

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
  assert(userCredentials, 'No user credentials')
  const isUpdate = !!account
  const { onAccountCreation, saveInVault } = konnectorPolicy

  let accountToSave = clone(account) || {}

  accountToSave = accounts.resetState(accountToSave)

  accountToSave = accounts.setSessionResetIfNecessary(
    accountToSave,
    userCredentials
  )

  accountToSave = isUpdate
    ? accounts.mergeAuth(accountToSave, userCredentials)
    : accounts.build(konnector, userCredentials)

  if (onAccountCreation) {
    logger.debug(
      `Using konnector policy "${konnectorPolicy.name}"'s custom  account creation`
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
export class KonnectorJob {
  constructor(
    client,
    { trigger = null, account = null, t = null, konnector = null } = {}
  ) {
    this.client = client
    this.trigger = trigger
    this.account = account
    this.konnector = konnector
    this.t = t
    this.unsubscribeAllRealtime = null

    // Bind methods used as callbacks
    this.getTwoFACodeProvider = this.getTwoFACodeProvider.bind(this)
    this.getKonnectorSlug = this.getKonnectorSlug.bind(this)
    this.handleAccountUpdated = this.handleAccountUpdated.bind(this)
    this.handleJobUpdated = this.handleJobUpdated.bind(this)
    this.handleTwoFA = this.handleTwoFA.bind(this)
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

  handleTwoFA(prevAccount) {
    const account = this.account

    const prevState = prevAccount && prevAccount.state
    const state = account.state

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
    if (isStepEvent(eventName)) {
      this.setState({ [eventName]: true })
    }
    if (eventToStatus[eventName]) {
      logger.debug(`Setting status ${eventToStatus[eventName]}`)
      this.setState({ status: eventToStatus[eventName] })
    }
    this.emit(eventName, ...args)
  }

  getAccount() {
    return this.account
  }

  async saveTwoFARequest(twoFARequestOptions) {
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
    logger.info('Waiting for two FA')
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
    logger.debug('Saving account')
    this.account = await saveAccount(
      this.client,
      this.konnector,
      updatedAccount
    )
    logger.info('Saved account')
    return this.account
  }

  flushTwoFAWaiters() {
    logger.debug(`Flushing ${this.twoFAWaiters.length} two fa waiters`)
    for (const callback of this.twoFAWaiters) {
      callback()
    }
    this.twoFAWaiters = []
  }

  async sendAdditionalInformation(fields) {
    this.setState({ status: RUNNING_TWOFA })
    try {
      const konnectorPolicy = this.getKonnectorPolicy()
      await konnectorPolicy.sendAdditionalInformation({
        account: this.account,
        client: this.client,
        flow: this,
        fields
      })
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
      logger.debug(`Sending two fa code ${code}`)
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
    const {
      konnector,
      cipherId,
      vaultClient,
      userCredentials,
      t
    } = options
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
        `Handling submit, with konnector policy ${konnectorPolicy.name}`
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
          'Bypassing cipher creation because of konnector account policy'
        )
      }

      logger.debug('Creating/updating account...')

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

      logger.info(`Saved account ${account._id}`)

      await this.ensureTriggerAndLaunch(client, { trigger, account, konnector })
    } catch (e) {
      logger.error(e)
      this.setState({ error: e })
      this.triggerEvent(ERROR_EVENT, e)
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
      this.handleTwoFA(prevAccount)
    } else if (accounts.isLoginSuccessHandled(state)) {
      this.handleLoginSuccessHandled()
    } else if (accounts.isLoginSuccess(state)) {
      this.handleLoginSuccess()
    }
  }

  async handleJobUpdated() {
    await this.refetchTrigger()
  }

  async refetchTrigger() {
    const trigger = await fetchTrigger(this.client, this.trigger._id)
    this.trigger = trigger
    this.emit(UPDATE_EVENT)
  }

  async ensureTriggerAndLaunch(client, { trigger, account, konnector, t }) {
    logger.debug('Ensuring trigger...')
    this.t = t
    trigger = await ensureTrigger(client, { trigger, account, konnector, t })
    logger.info(`Trigger is ${trigger._id}`)
    this.trigger = trigger
    this.emit(UPDATE_EVENT)
    await this.launch()
  }

  /**
   * Launches the job and sets everything up to follow execution.
   */
  async launch() {
    logger.info('Launching job...')
    this.setState({ status: PENDING })

    this.account = await prepareTriggerAccount(this.client, this.trigger)
    this.realtime.subscribe(
      'updated',
      ACCOUNTS_DOCTYPE,
      this.account._id,
      this.handleAccountUpdated
    )
    logger.info(`Subscribed to ${ACCOUNTS_DOCTYPE}:${this.account._id}`)

    this.job = await launchTrigger(this.client, this.trigger)
    this.realtime.subscribe(
      'updated',
      JOBS_DOCTYPE,
      this.job._id,
      this.handleJobUpdated.bind(this)
    )
    this.jobWatcher = watchKonnectorJob(this.client, this.job)
    logger.info(`Subscribed to ${JOBS_DOCTYPE}:${this.job._id}`)

    for (const ev of JOB_EVENTS) {
      this.jobWatcher.on(ev, () => this.triggerEvent(ev))
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

  getDerivedState() {
    const trigger = this.trigger
    const { status } = this.state
    return {
      running: ![ERRORED, IDLE, SUCCESS].includes(status),
      twoFARunning: status === RUNNING_TWOFA,
      twoFARetry: status == TWO_FA_MISMATCH,
      triggerError: triggersModel.getKonnectorJobError(trigger),
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
    } else {
      const fields = konnectorPolicy.getAdditionalInformationNeeded(this)
      return fields
    }
  }
}

MicroEE.mixin(KonnectorJob)

export default KonnectorJob
