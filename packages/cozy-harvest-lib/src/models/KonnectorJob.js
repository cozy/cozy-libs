import MicroEE from 'microee'

import accounts from '../helpers/accounts'
import triggers from '../helpers/triggers'

import accountsMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'

export const ERROR_EVENT = 'error'
export const LOGIN_SUCCESS_EVENT = 'loginSuccess'
export const SUCCESS_EVENT = 'success'
export const TWO_FA_REQUEST_EVENT = 'twoFARequest'
export const TWO_FA_MISMATCH_EVENT = 'twoFAMismatch'

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

    this.accountsMutations = accountsMutations(this.client)
    this.triggersMutations = triggersMutations(this.client)

    // Bind methods used as callbacks
    this.handleTwoFA = this.handleTwoFA.bind(this)
    this.sendTwoFACode = this.sendTwoFACode.bind(this)
  }

  // TODO: Pass updated account as parameter
  handleTwoFA(state) {
    const hasChanged = this.account.state !== state
    if (!hasChanged) return

    this.account.state = state

    if (accounts.isTwoFANeeded(state)) {
      this.emit(TWO_FA_REQUEST_EVENT, this.account)
    } else if (accounts.isTwoFARetry(state)) {
      this.emit(TWO_FA_MISMATCH_EVENT, this.account)
    }
  }

  /**
   * Re-emit an event received from an internal object
   */
  reEmit(event) {
    return (...args) => this.emit(event, ...args)
  }

  /**
   * Send Two FA Code, i.e. save it into account
   */
  async sendTwoFACode(code) {
    const { updateAccount } = this.accountsMutations
    try {
      await updateAccount(accounts.updateTwoFaCode(this.account, code))
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Launch the job and set up everything to follow execution.
   */
  async launch() {
    const { watchKonnectorAccount } = this.accountsMutations
    const { launchTrigger, watchKonnectorJob } = this.triggersMutations

    this.account = await prepareTriggerAccount(
      this.trigger,
      this.accountsMutations
    )

    watchKonnectorAccount(this.account, {
      onTwoFACodeAsked: this.handleTwoFA
    })

    const konnectorJob = watchKonnectorJob(await launchTrigger(this.trigger))
    // Temporary reEmitting until merging of KonnectorJobWatcher and
    // KonnectorAccountWatcher into KonnectorJob
    konnectorJob.on(ERROR_EVENT, this.reEmit(ERROR_EVENT))
    konnectorJob.on(LOGIN_SUCCESS_EVENT, this.reEmit(LOGIN_SUCCESS_EVENT))
    konnectorJob.on(SUCCESS_EVENT, this.reEmit(SUCCESS_EVENT))
  }
}

MicroEE.mixin(KonnectorJob)

export default KonnectorJob
