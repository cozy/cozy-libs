import MicroEE from 'microee'

import accounts from '../helpers/accounts'
import triggers from '../helpers/triggers'

import accountsMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'

// events
export const ERROR_EVENT = 'error'
export const LOGIN_SUCCESS_EVENT = 'loginSuccess'
export const SUCCESS_EVENT = 'success'
export const TWO_FA_REQUEST_EVENT = 'twoFARequest'
export const TWO_FA_MISMATCH_EVENT = 'twoFAMismatch'

// statuses
export const IDLE = 'IDLE'
export const PENDING = 'PENDING'
export const ERRORED = 'ERRORED'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const SUCCESS = 'SUCCESS'
export const RUNNING_TWOFA = 'RUNNING_TWOFA'
export const TWO_FA_MISMATCH = 'TWO_FA_MISMATCH'
export const TWO_FA_REQUEST = 'TWO_FA_REQUEST'

// helpers
export const prepareTriggerAccount = async (trigger, accountsMutations) => {
  const { findAccount, updateAccount } = accountsMutations
  const account = await findAccount(triggers.getAccountId(trigger))
  if (!account) throw new Error('Trigger has no account')
  return await updateAccount(accounts.resetState(account))
}

export class KonnectorJob {
  constructor(client, trigger) {
    this.client = client
    this.trigger = trigger
    this.account = null

    this.accountsMutations = accountsMutations(this.client)
    this.triggersMutations = triggersMutations(this.client)

    // Bind methods used as callbacks
    this.getTwoFACodeProvider = this.getTwoFACodeProvider.bind(this)
    this.getKonnectorSlug = this.getKonnectorSlug.bind(this)
    this.handleLegacyEvent = this.handleLegacyEvent.bind(this)
    this.handleTwoFA = this.handleTwoFA.bind(this)
    this.launch = this.launch.bind(this)
    this.sendTwoFACode = this.sendTwoFACode.bind(this)

    // status and setter/getters
    this._status = IDLE
    this.setStatus = this.setStatus.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.isRunning = this.isRunning.bind(this)
    this.isTwoFARunning = this.isTwoFARunning.bind(this)
    this.isTwoFARetry = this.isTwoFARetry.bind(this)
  }

  setStatus(status) {
    this._status = status
  }

  getStatus() {
    return this._status
  }

  isRunning() {
    return ![ERRORED, IDLE, SUCCESS].includes(this.getStatus())
  }

  isTwoFARunning() {
    return this.getStatus() === RUNNING_TWOFA
  }

  isTwoFARetry() {
    return this.getStatus() === TWO_FA_MISMATCH
  }

  getTwoFACodeProvider() {
    return accounts.getTwoFACodeProvider(this.account)
  }

  getKonnectorSlug() {
    return this.trigger.message.konnector
  }

  // TODO: Pass updated account as parameter
  handleTwoFA(state) {
    const hasChanged = this.account.state !== state
    if (!hasChanged) return

    this.account.state = state

    if (accounts.isTwoFANeeded(state)) {
      this.setStatus(TWO_FA_REQUEST)
      this.emit(TWO_FA_REQUEST_EVENT, this.account)
    } else if (accounts.isTwoFARetry(state)) {
      this.setStatus(TWO_FA_MISMATCH)
      this.emit(TWO_FA_MISMATCH_EVENT, this.account)
    }
  }

  /**
   * Legacy events use the KonnectorJobWatcher unstil it has been merged into
   * KonnectorJob so we need to re-emit the events
   */
  handleLegacyEvent(event) {
    return (...args) => {
      switch (event) {
        case ERROR_EVENT:
          this.setStatus(ERRORED)
          break
        case LOGIN_SUCCESS_EVENT:
          this.setStatus(LOGIN_SUCCESS)
          break
        case SUCCESS_EVENT:
          this.setStatus(SUCCESS)
          break
      }
      this.emit(event, ...args)
    }
  }

  /**
   * Send Two FA Code, i.e. save it into account
   */
  async sendTwoFACode(code) {
    this.setStatus(RUNNING_TWOFA)
    const { updateAccount } = this.accountsMutations
    try {
      await updateAccount(accounts.updateTwoFaCode(this.account, code))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      this.setStatus(ERRORED)
    }
  }

  /**
   * Launch the job and set up everything to follow execution.
   */
  async launch() {
    this.setStatus(PENDING)
    const { watchKonnectorAccount } = this.accountsMutations
    const { launchTrigger, watchKonnectorJob } = this.triggersMutations

    this.account = await prepareTriggerAccount(
      this.trigger,
      this.accountsMutations
    )

    const konnectorJob = watchKonnectorJob(await launchTrigger(this.trigger))
    // Temporary reEmitting until merging of KonnectorJobWatcher and
    // KonnectorAccountWatcher into KonnectorJob
    konnectorJob.on(ERROR_EVENT, this.handleLegacyEvent(ERROR_EVENT))
    konnectorJob.on(
      LOGIN_SUCCESS_EVENT,
      this.handleLegacyEvent(LOGIN_SUCCESS_EVENT)
    )
    konnectorJob.on(SUCCESS_EVENT, this.handleLegacyEvent(SUCCESS_EVENT))

    watchKonnectorAccount(this.account, {
      onTwoFACodeAsked: this.handleTwoFA,
      onLoginSuccess: konnectorJob.handleSuccess,
      onLoginSuccessHandled: konnectorJob.disableSuccessTimer
    })
  }
}

MicroEE.mixin(KonnectorJob)

export default KonnectorJob
