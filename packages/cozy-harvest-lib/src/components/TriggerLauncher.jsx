import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'

import TwoFAForm from './TwoFAForm'
import { accountsMutations } from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'

import {
  withKonnectorJob,
  ERROR_EVENT,
  SUCCESS_EVENT,
  TWO_FA_REQUEST_EVENT,
  TWO_FA_MISMATCH_EVENT
} from '../models/KonnectorJob'

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
  constructor(props, context) {
    super(props, context)
    this.state = { showTwoFAModal: false }

    this.dismissTwoFAModal = this.dismissTwoFAModal.bind(this)
    this.displayTwoFAModal = this.displayTwoFAModal.bind(this)
  }

  componentDidMount() {
    this.props.konnectorJob
      .on(ERROR_EVENT, this.dismissTwoFAModal)
      .on(SUCCESS_EVENT, this.dismissTwoFAModal)
      .on(TWO_FA_REQUEST_EVENT, this.displayTwoFAModal)
      .on(TWO_FA_MISMATCH_EVENT, this.displayTwoFAModal)
  }

  dismissTwoFAModal() {
    // TODO: Make the modal not closable, or offer possibility to re-open it.
    this.setState({ showTwoFAModal: false })
  }

  displayTwoFAModal() {
    this.setState({ showTwoFAModal: true })
  }

  render() {
    const { showTwoFAModal } = this.state
    const {
      account,
      children,
      konnector,
      konnectorJob,
      submitting
    } = this.props

    return (
      <div>
        {children({
          launch: konnectorJob.launch,
          running: konnectorJob.isRunning() || submitting
        })}
        {showTwoFAModal && (
          <TwoFAForm
            account={account}
            konnector={konnector}
            dismissAction={this.dismissTwoFAModal}
            handleSubmitTwoFACode={konnectorJob.sendTwoFACode}
            submitting={konnectorJob.isTwoFARunning()}
            retryAsked={konnectorJob.isTwoFARetry()}
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
   * Account document to use for 2FA
   */
  account: PropTypes.object.isRequired,
  /**
   * Konnector required to fetch app icon
   */
  konnector: PropTypes.object.isRequired,
  /**
   * Indicates if trigger is already runnning
   */
  submitting: PropTypes.bool
}

export default withKonnectorJob(
  withMutations(accountsMutations, triggersMutations)(TriggerLauncher)
)
