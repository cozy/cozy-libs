import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'

import TwoFAModal from './TwoFA/Modal'
import { accountsMutations } from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'

import KonnectorJob from '../models/KonnectorJob'

// Statuses
const ERRORED = 'ERRORED'
const IDLE = 'IDLE'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const TWO_FA_REQUEST = 'TWO_FA_REQUEST'
const TWO_FA_MISMATCH = 'TWO_FA_MISMATCH'
const PENDING = 'PENDING'
const SUCCESS = 'SUCCESS'

/**
 * Trigger Launcher renders its children with following props:
 * * launch: Callback to launch the trigger
 * * running: Boolean which indicates if the trigger is running
 *
 * ### Example
 * ```js
 * <TriggerLauncher trigger={trigger}>
 *   {(launch, running) => (
 *     <Button onClick={launch} disabled={running}
 *    )}
 * </TriggerLauncher>
 * ```
 *
 * TODO: inject other props to indicates status (for example: loginSucceed),
 * and use callbacks like `onLoginSuccess` to make this component usable in
 * TriggerManager for example
 */
export class TriggerLauncher extends Component {
  state = {
    status: IDLE
  }

  constructor(props, context) {
    super(props, context)

    this.launch = this.launch.bind(this)
    this.handleTwoFAModalDismiss = this.handleTwoFAModalDismiss.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this)
    this.handleTwoFARequest = this.handleTwoFARequest.bind(this)
  }

  handleTwoFAModalDismiss() {
    // TODO: Make the modale not closable, or offer possibility to re-open it.
    this.setState({ showTwoFAModal: false })
  }

  handleError() {
    this.setState({ status: ERRORED, showTwoFAModal: false })
  }

  handleSuccess() {
    this.setState({ status: SUCCESS, showTwoFAModal: false })
  }

  handleLoginSuccess() {
    this.setState({ status: LOGIN_SUCCESS })
  }

  handleTwoFARequest() {
    this.setState({ status: TWO_FA_REQUEST, showTwoFAModal: true })
  }

  handleTwoFAMismatch() {
    this.setState({ status: TWO_FA_MISMATCH, showTwoFAModal: true })
  }

  async launch() {
    const { trigger } = this.props
    const { client } = this.context

    this.setState({ status: PENDING })

    this.konnectorJob = new KonnectorJob(client, trigger)
    this.konnectorJob
      .on('error', this.handleError)
      .on('loginSuccess', this.handleLoginSuccess)
      .on('success', this.handleSuccess)
      .on('twoFARequest', this.handleTwoFARequest)
      .on('twoFAMismatch', this.handleTwoFAMismatch)
    this.konnectorJob.launch()
  }

  render() {
    const { showTwoFAModal, status } = this.state
    const { children, submitting } = this.props

    return (
      <div>
        {children({
          launch: this.launch,
          running: ![ERRORED, IDLE, SUCCESS].includes(status) || submitting
        })}
        {showTwoFAModal && (
          <TwoFAModal
            dismissAction={this.handleTwoFAModalDismiss}
            hasError={status === TWO_FA_MISMATCH}
            onSubmit={this.konnectorJob.sendTwoFACode}
            into="coz-harvest-modal-place"
          />
        )}
      </div>
    )
  }
}

TriggerLauncher.propTypes = {
  /**
   * Mandatory for render prop
   */
  children: PropTypes.func.isRequired,
  /**
   * Indicates if trigger is already runnning
   */
  submitting: PropTypes.bool,
  /**
   * The trigger to launch
   */
  trigger: PropTypes.object.isRequired
}

TriggerLauncher.contextTypes = {
  client: PropTypes.object.isRequired
}

export default withMutations(accountsMutations, triggersMutations)(
  TriggerLauncher
)
