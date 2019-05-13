import MicroEE from 'microee'

import accounts from '../helpers/accounts'
import triggers from '../helpers/triggers'
import cron from '../helpers/cron'
import konnectors from '../helpers/konnectors'
import { slugify } from '../helpers/slug'

import accountsMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import permissionsMutations from '../connections/permissions'
import filesMutations from '../connections/files'

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
export const prepareTriggerAccountIfExists = async (
  trigger,
  accountsMutations
) => {
  if (!trigger) return null
  const { findAccount, updateAccount } = accountsMutations
  const account = await findAccount(triggers.getAccountId(trigger))
  if (!account) return null
  return await updateAccount(accounts.resetState(account))
}

export class KonnectorJob {
  constructor(client, trigger, account = null) {
    this.client = client
    this.trigger = trigger
    this.account = account
    this.unsubscribeAllRealtime = null

    // mutations
    this.accountsMutations = accountsMutations(this.client)
    this.triggersMutations = triggersMutations(this.client)
    this.permissionsMutations = permissionsMutations(this.client)
    this.filesMutations = filesMutations(this.client)

    // KonnectorJob methods
    this.handleError = this.handleError.bind(this)
    this.handleLegacyEvent = this.handleLegacyEvent.bind(this)
    this.handleTwoFA = this.handleTwoFA.bind(this)
    this.launch = this.launch.bind(this)
    this.sendTwoFACode = this.sendTwoFACode.bind(this)
    this.unwatch = this.unwatch.bind(this)
    this.prepareConnection = this.prepareConnection.bind(this)

    // konnector info getter (from trigger)
    this.getKonnectorSlug = this.getKonnectorSlug.bind(this)

    // account setter/getters
    this.getTwoFACodeProvider = this.getTwoFACodeProvider.bind(this)
    this.getAccount = this.getAccount.bind(this)
    this.createOrUpdateAccountData = this.createOrUpdateAccountData.bind(this)

    // status setter/getters
    this._status = IDLE
    this.setStatus = this.setStatus.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.isRunning = this.isRunning.bind(this)
    this.isTwoFARunning = this.isTwoFARunning.bind(this)
    this.isTwoFARetry = this.isTwoFARetry.bind(this)

    // trigger setter/getters
    this.getTrigger = this.getTrigger.bind(this)
    this.getTriggerError = this.getTriggerError.bind(this)
    this.ensureTrigger = this.ensureTrigger.bind(this)
  }

  /**
   * TRIGGER
   */
  getTrigger() {
    return this.trigger
  }

  getTriggerError() {
    return triggers.getError(this.getTrigger())
  }

  /**
   * Ensure that a trigger will exist, with valid destination folder with
   * permissions and references
   * @param  {Object}  konnector Konnector related document, required to create
   *                             a trigger
   */
  async ensureTrigger(konnector, baseDir = '') {
    if (this.trigger) return
    if (!this.account) {
      this.handleError(new Error('No account found to create a trigger'))
    }

    const { addPermission } = this.permissionsMutations
    const {
      addReferencesTo,
      createDirectoryByPath,
      statDirectoryByPath
    } = this.permissionsMutations
    const { createTrigger } = this.triggersMutations

    let folder

    try {
      if (konnectors.needsFolder(konnector)) {
        const path = `${baseDir}/${konnector.name}/${slugify(
          accounts.getLabel(this.account)
        )}`

        folder =
          (await statDirectoryByPath(path)) ||
          (await createDirectoryByPath(path))

        await addPermission(konnector, konnectors.buildFolderPermission(folder))
        await addReferencesTo(konnector, [folder])
      }

      const createdTrigger = await createTrigger(
        triggers.buildAttributes({
          account: this.account,
          cron: cron.fromKonnector(konnector),
          folder,
          konnector
        })
      )
      this.trigger = createdTrigger
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * STATUS
   */
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

  /**
   * ACCOUNT
   */
  getAccount() {
    return this.account
  }

  getTwoFACodeProvider() {
    return accounts.getTwoFACodeProvider(this.account)
  }

  /**
   * Create the account document if it not exists or update it
   * @param  {Object}  konnector Konnector related document
   * @param  {Object}  data      Data from the account form
   * @return {Promise}           Saved account document
   */
  async createOrUpdateAccountData(konnector, data = {}) {
    const { saveAccount } = this.accountsMutations

    this.account = await prepareTriggerAccountIfExists(
      this.trigger,
      this.accountsMutations
    )

    try {
      const accountToSave = this.account
        ? accounts.mergeAuth(
            accounts.setSessionResetIfNecessary(
              accounts.resetState(this.account),
              data
            ),
            data
          )
        : accounts.build(konnector, data)
      const savedAccount = accounts.mergeAuth(
        await saveAccount(konnector, accountToSave),
        data
      )
      this.account = savedAccount
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * KONNECTOR
   */
  /**
   * Get konnector slug from the trigger message
   * @return {String} The related konnector slug
   */
  getKonnectorSlug() {
    return this.trigger.message.konnector
  }

  /**
   * KONNECTORJOB
   */

  /**
   * Create the account and the trigger if they don't already exist or update
   * the account to prepare for a connection launching
   * @param  {Object}  konnector Konnector document
   * @param  {Object}  data      Data from the account form
   * @param  {String}  baseDir   Root directory to store konnectors fetched files
   */
  async prepareConnection(konnector, data, baseDir) {
    this.setStatus(PENDING)
    if (!konnector)
      this.handleError(
        new Error('A konnector must be provided to start a connection')
      )
    await this.createOrUpdateAccountData(konnector, data)
    await this.ensureTrigger(konnector, baseDir)
  }

  /**
   * Log and set the status if error encountered
   * @param  {Error} error The error object
   */
  handleError(error) {
    // eslint-disable-next-line no-console
    console.error(error)
    this.setStatus(ERRORED)
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
      this.handleError(error)
    }
  }

  /**
   * Launch the job and set up everything to follow execution.
   */
  async launch() {
    this.setStatus(PENDING)
    const { watchKonnectorAccount } = this.accountsMutations
    const { launchTrigger, watchKonnectorJob } = this.triggersMutations

    this.account = await prepareTriggerAccountIfExists(
      this.trigger,
      this.accountsMutations
    )

    if (!this.account) {
      return this.handleError(
        new Error(
          `Trigger ${this.trigger._id} has no account, it can't be launched.`
        )
      )
    }

    const jobWatcher = watchKonnectorJob(await launchTrigger(this.trigger))
    // Temporary reEmitting until merging of KonnectorJobWatcher and
    // KonnectorAccountWatcher into KonnectorJob
    jobWatcher.on(ERROR_EVENT, this.handleLegacyEvent(ERROR_EVENT))
    jobWatcher.on(
      LOGIN_SUCCESS_EVENT,
      this.handleLegacyEvent(LOGIN_SUCCESS_EVENT)
    )
    jobWatcher.on(SUCCESS_EVENT, this.handleLegacyEvent(SUCCESS_EVENT))

    const accountWatcher = watchKonnectorAccount(this.account, {
      onTwoFACodeAsked: this.handleTwoFA,
      onLoginSuccess: jobWatcher.handleSuccess,
      onLoginSuccessHandled: jobWatcher.disableSuccessTimer
    })

    this.unsubscribeAllRealtime = () => {
      jobWatcher.unsubscribeAll()
      accountWatcher.unsubscribeAll()
    }
  }

  unwatch() {
    if (typeof this.unsubscribeAllRealtime === 'function') {
      this.unsubscribeAllRealtime()
    }
  }
}

MicroEE.mixin(KonnectorJob)

export default KonnectorJob
