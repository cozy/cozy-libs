import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'

import TwoFAModal from './TwoFAModal'
import { accountsMutations } from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'
import withKonnectorJob from './hoc/withKonnectorJob'

import {
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

  componentWillUnmount() {
    this.props.konnectorJob.unwatch()
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
    const { children, konnectorJob, submitting } = this.props

    return (
      <div>
        {children({
          launch: konnectorJob.launch,
          running: konnectorJob.isRunning() || submitting
        })}
        {showTwoFAModal && (
          <TwoFAModal
            konnectorJob={konnectorJob}
            dismissAction={this.dismissTwoFAModal}
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
   * The konnectorJob instance provided by withKonnectorJob
   */
  konnectorJob: PropTypes.object.isRequired,
  /**
   * Indicates if trigger is already runnning
   */
  submitting: PropTypes.bool
}

export default withKonnectorJob(
  withMutations(accountsMutations, triggersMutations)(TriggerLauncher)
)
