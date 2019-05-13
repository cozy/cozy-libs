import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'

import withKonnectorJob from './HOCs/withKonnectorJob'
import AccountForm from './AccountForm'
import TwoFAModal from './TwoFAModal'

import {
  ERROR_EVENT,
  SUCCESS_EVENT,
  LOGIN_SUCCESS_EVENT,
  TWO_FA_REQUEST_EVENT,
  TWO_FA_MISMATCH_EVENT
} from '../models/KonnectorJob'

const MODAL_PLACE_ID = 'coz-harvest-modal-place'

/**
 * Manage a trigger for a given konnector, from account edition to trigger
 * creation and launch.
 * @type {Component}
 */
export class TriggerManager extends Component {
  constructor(props) {
    super(props)
    this.dismissTwoFAModal = this.dismissTwoFAModal.bind(this)
    this.displayTwoFAModal = this.displayTwoFAModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)

    this.state = {
      showTwoFAModal: false
    }
  }

  componentWillUnmount() {
    const { konnectorJob } = this.props
    if (konnectorJob) konnectorJob.unwatch()
  }

  componentDidMount() {
    const { konnectorJob } = this.props
    konnectorJob
      .on(ERROR_EVENT, this.dismissTwoFAModal)
      .on(SUCCESS_EVENT, this.dismissTwoFAModal)
      .on(TWO_FA_REQUEST_EVENT, this.displayTwoFAModal)
      .on(TWO_FA_MISMATCH_EVENT, this.displayTwoFAModal)
  }

  /**
   * Account submitting and trigger launching. Errors, events and statuses
   * are handled by konnectorJob
   * @param  {Object}  data [description]
   */
  async handleSubmit(data) {
    const { konnector, konnectorJob, onLoginSuccess, onSuccess, t } = this.props

    // prepare the connection, create account and trigger if needed
    await konnectorJob.prepareConnection(konnector, data, t('default.baseDir'))
    if (onLoginSuccess) {
      konnectorJob.on(LOGIN_SUCCESS_EVENT, () =>
        this.handleSuccess(onLoginSuccess, [konnectorJob.getTrigger()])
      )
    }
    if (onSuccess) {
      konnectorJob.on(SUCCESS_EVENT, () =>
        this.handleSuccess(onSuccess, [konnectorJob.getTrigger()])
      )
    }
    konnectorJob.launch()
  }

  /**
   * Handle a success, typically job success or login success
   * @param  {Function} successCallback Typically onLoginSuccess or onSuccess
   * @param  {Array} args            Callback arguments
   */
  handleSuccess(successCallback, args) {
    successCallback(...args)
  }

  dismissTwoFAModal() {
    this.setState({ showTwoFAModal: false })
  }

  displayTwoFAModal() {
    this.setState({ showTwoFAModal: true })
  }

  render() {
    const {
      konnector,
      konnectorJob,
      running,
      showError,
      modalContainerId
    } = this.props
    const { showTwoFAModal } = this.state
    const submitting = konnectorJob.isRunning() || running
    const modalInto = modalContainerId || MODAL_PLACE_ID

    return (
      <div>
        <div id={modalInto} />
        <AccountForm
          account={konnectorJob.getAccount()}
          error={konnectorJob.getTriggerError()}
          konnector={konnector}
          onSubmit={this.handleSubmit}
          showError={showError}
          submitting={submitting}
        />
        {showTwoFAModal && (
          <TwoFAModal
            konnectorJob={konnectorJob}
            dismissAction={this.closeTwoFAModal}
            into={modalInto}
          />
        )}
      </div>
    )
  }
}

TriggerManager.propTypes = {
  /**
   * Konnector document. AccountForm will check the `fields` object to compute
   * fields.
   * @type {Object}
   */
  konnector: PropTypes.object.isRequired,
  /**
   * The konnectorJob instance provided by withKonnectorJob
   */
  konnectorJob: PropTypes.object.isRequired,
  /**
   * Indicates if the TriggerManager has to show errors. Sometimes errors may be
   * displayed elsewhere. However, a KonnectorJobError corresponding to a login
   * error is always displayed. Transmitted to AccountForm.
   * @type {Boolean}
   */
  showError: PropTypes.bool,
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

export default translate()(withKonnectorJob(TriggerManager))
