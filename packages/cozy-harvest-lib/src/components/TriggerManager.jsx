import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'

import AccountForm from './AccountForm'
import OAuthForm from './OAuthForm'
import TwoFAForm from './TwoFAForm'
import accountsMutations from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'
import filesMutations from '../connections/files'
import permissionsMutations from '../connections/permissions'
import accounts from '../helpers/accounts'
import cron from '../helpers/cron'
import konnectors from '../helpers/konnectors'
import { slugify } from '../helpers/slug'
import triggers from '../helpers/triggers'
import withLocales from './hoc/withLocales'

const ERRORED = 'ERRORED'
const IDLE = 'IDLE'
const RUNNING = 'RUNNING'
const RUNNING_TWOFA = 'RUNNING_TWOFA'

const MODAL_PLACE_ID = 'coz-harvest-modal-place'

/**
 * Manage a trigger for a given konnector, from account edition to trigger
 * creation and launch.
 * @type {Component}
 */
export class TriggerManager extends Component {
  constructor(props) {
    super(props)
    const { account, trigger } = props

    this.handleNewAccount = this.handleNewAccount.bind(this)
    this.handleOAuthAccountId = this.handleOAuthAccountId.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.closeTwoFAModal = this.closeTwoFAModal.bind(this)
    this.disableSuccessTimer = this.disableSuccessTimer.bind(this)
    this.handleLoginSuccessState = this.handleLoginSuccessState.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleTwoFACodeAsked = this.handleTwoFACodeAsked.bind(this)
    this.handleSubmitTwoFACode = this.handleSubmitTwoFACode.bind(this)

    this.jobWatcher = null
    this.accountWatcher = null

    this.state = {
      account,
      error: triggers.getError(trigger),
      status: IDLE,
      trigger
    }
  }

  componentWillUnmount() {
    if (this.jobWatcher) this.jobWatcher.unsubscribeAll()
    if (this.accountWatcher) this.accountWatcher.unsubscribeAll()
  }

  closeTwoFAModal() {
    this.setState({
      status: RUNNING
    })
  }

  disableSuccessTimer() {
    if (this.jobWatcher) this.jobWatcher.disableSuccessTimer()
  }

  handleLoginSuccessState() {
    if (this.jobWatcher) this.jobWatcher.handleSuccess()
  }

  /**
   * Ensure that a trigger will exist, with valid destination folder with
   * permissions and references
   * @return {Object} Trigger document
   */
  async ensureTrigger() {
    const {
      addPermission,
      addReferencesTo,
      createDirectoryByPath,
      createTrigger,
      statDirectoryByPath,
      konnector,
      t
    } = this.props

    const { account, trigger } = this.state

    if (trigger) {
      return trigger
    }

    let folder

    if (konnectors.needsFolder(konnector)) {
      const path = `${t('default.baseDir')}/${konnector.name}/${slugify(
        accounts.getLabel(account)
      )}`

      folder =
        (await statDirectoryByPath(path)) || (await createDirectoryByPath(path))

      await addPermission(konnector, konnectors.buildFolderPermission(folder))
      await addReferencesTo(konnector, [folder])
    }

    return await createTrigger(
      triggers.buildAttributes({
        account,
        cron: cron.fromKonnector(konnector),
        folder,
        konnector
      })
    )
  }

  /**
   * OAuth Form success handler. OAuthForm retrieves an account id created by the
   * cozy stack
   * @param  {string}  accountId
   */
  async handleOAuthAccountId(accountId) {
    const { findAccount } = this.props
    try {
      const oAuthAccount = await findAccount(accountId)
      return await this.handleNewAccount(oAuthAccount)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Account creation success handler
   * @param  {Object}  account Created io.cozy.accounts document
   * @return {Object}          io.cozy.jobs document, runned with account data
   */
  async handleNewAccount(account) {
    this.setState({ account, error: null, status: RUNNING })
    const trigger = await this.ensureTrigger()
    this.setState({ trigger })
    this.accountWatcher = this.props.watchKonnectorAccount(account, {
      onTwoFACodeAsked: this.handleTwoFACodeAsked,
      onLoginSuccess: this.handleLoginSuccessState,
      onLoginSuccessHandled: this.disableSuccessTimer
    })
    return await this.launch(trigger)
  }

  handleError(error) {
    this.setState({
      error,
      status: ERRORED
    })
  }

  handleTwoFACodeAsked(statusCode) {
    const { status } = this.state
    if (accounts.isTwoFANeeded(status)) return
    // disable successTimeout since asked Two FA code
    this.disableSuccessTimer()
    this.setState({
      status: statusCode
    })
  }

  async handleSubmitTwoFACode(code) {
    const { konnector, saveAccount } = this.props
    const { account } = this.state
    this.setState({
      error: null,
      status: RUNNING_TWOFA
    })
    try {
      await saveAccount(konnector, accounts.updateTwoFaCode(account, code))
      if (this.jobWatcher) this.jobWatcher.enableSuccessTimer(10000)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async handleSubmit(data = {}) {
    const { konnector, saveAccount } = this.props

    const { account } = this.state
    const isUpdate = !!account

    this.setState({
      error: null,
      status: RUNNING
    })

    try {
      const accountToSave = isUpdate
        ? accounts.mergeAuth(
            accounts.setSessionResetIfNecessary(
              accounts.resetState(account),
              data
            ),
            data
          )
        : accounts.build(konnector, data)
      const savedAccount = accounts.mergeAuth(
        await saveAccount(konnector, accountToSave),
        data
      )
      return await this.handleNewAccount(savedAccount)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handle a success, typically job success or login success
   * @param  {Function} successCallback Typically onLoginSuccess or onSuccess
   * @param  {Array} args            Callback arguments
   */
  handleSuccess(successCallback, args) {
    this.setState({ status: IDLE })
    if (typeof successCallback !== 'function') return
    successCallback(...args)
  }

  /**
   * Launches a trigger
   * @param  {Object}  trigger io.cozy.triggers document
   * @return {Promise}         [description]
   */
  async launch(trigger) {
    const {
      launchTrigger,
      onLoginSuccess,
      onSuccess,
      watchKonnectorJob
    } = this.props
    this.jobWatcher = watchKonnectorJob(await launchTrigger(trigger))
    this.jobWatcher.on('error', this.handleError)
    this.jobWatcher.on('loginSuccess', () =>
      this.handleSuccess(onLoginSuccess, [trigger])
    )
    this.jobWatcher.on('success', () =>
      this.handleSuccess(onSuccess, [trigger])
    )
  }

  render() {
    const { konnector, running, showError, modalContainerId } = this.props
    const { account, error, status } = this.state
    const submitting = status === RUNNING || running
    const submittingTwoFA = status === RUNNING_TWOFA
    const waitForTwoFACode = accounts.isTwoFANeeded(status)
    const isTwoFARetryCode = accounts.isTwoFARetry(status)
    const display2FA = waitForTwoFACode || submittingTwoFA || isTwoFARetryCode
    const modalInto = modalContainerId || MODAL_PLACE_ID

    const { oauth } = konnector

    if (oauth) {
      return (
        <OAuthForm
          account={account}
          konnector={konnector}
          onSuccess={this.handleOAuthAccountId}
          submitting={submitting || display2FA}
        />
      )
    }

    return (
      <div>
        <div id={modalInto} />
        <AccountForm
          account={account}
          error={error}
          konnector={konnector}
          onSubmit={this.handleSubmit}
          showError={showError}
          submitting={submitting || display2FA}
        />
        {display2FA && (
          <TwoFAForm
            account={account}
            konnector={konnector}
            dismissAction={this.closeTwoFAModal}
            handleSubmitTwoFACode={this.handleSubmitTwoFACode}
            submitting={submittingTwoFA}
            into={modalInto}
            retryAsked={isTwoFARetryCode && !submittingTwoFA}
          />
        )}
      </div>
    )
  }
}

TriggerManager.propTypes = {
  /**
   * Account document. Used to get intial form values.
   * If no account is passed, AccountForm will use empty initial values.
   * @type {Object}
   */
  account: PropTypes.object,
  /**
   * Konnector document. AccountForm will check the `fields` object to compute
   * fields.
   * @type {Object}
   */
  konnector: PropTypes.object.isRequired,
  /**
   * Indicates if the TriggerManager has to show errors. Sometimes errors may be
   * displayed elsewhere. However, a KonnectorJobError corresponding to a login
   * error is always displayed. Transmitted to AccountForm.
   * @type {Boolean}
   */
  showError: PropTypes.bool,
  /**
   * Existing trigger document to manage.
   * @type {Object}
   */
  trigger: PropTypes.object,
  /**
   * Indicates if the given trigger is already running, i.e. if it has been
   * launched and if an associated job with status 'running' exists.
   * @type {[type]}
   */
  running: PropTypes.bool,
  /**
   * Translation function
   */
  t: PropTypes.func,
  //
  // mutations
  //
  /**
   * Permission mutation
   * @type {Function}
   */
  addPermission: PropTypes.func,
  /**
   * File mutation
   * @type {Function}
   */
  addReferencesTo: PropTypes.func,
  /**
   * Trigger mutation
   * @type {Function}
   */
  createTrigger: PropTypes.func.isRequired,
  /**
   * Trigger mutations
   * @type {Function}
   */
  createDirectoryByPath: PropTypes.func,
  /**
   * Account Mutation, used to retrieve OAuth account
   * @type {Function}
   */
  findAccount: PropTypes.func,
  /**
   * Trigger mutation
   * @type {Function}
   */
  launchTrigger: PropTypes.func.isRequired,
  /**
   * Account mutation
   * @type {Func}
   */
  saveAccount: PropTypes.func.isRequired,
  /**
   * Account mutations
   * @type {Function}
   */
  watchKonnectorAccount: PropTypes.func.isRequired,
  /**
   * Trigger mutations
   * @type {Function}
   */
  statDirectoryByPath: PropTypes.func,
  /**
   * Job mutations
   * @type {Function}
   */
  watchKonnectorJob: PropTypes.func.isRequired,
  //
  // Callbacks
  //
  /**
   * Callback invoked when the trigger has been launched and the login to the
   * remote service has succeeded.
   * @type {Function}
   */
  onLoginSuccess: PropTypes.func,
  /**
   * Callback invoked when the trigger has been launched and the job ended
   * successfully.
   * @type {Function}
   */
  onSuccess: PropTypes.func
}

export default withLocales(
  withMutations(
    accountsMutations,
    filesMutations,
    permissionsMutations,
    triggersMutations
  )(TriggerManager)
)
