import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withClient, withMutations } from 'cozy-client'

import TwoFAModal from './TwoFAModal'
import { accountsMutations } from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'
import withLocales from './hoc/withLocales'

import KonnectorJob, {
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
    const { trigger } = this.props
    this.state = { showTwoFAModal: false, trigger }

    this.handleTwoFA = this.handleTwoFA.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)

    this.launch = this.launch.bind(this)
  }

  launch() {
    const { client, onLaunch, trigger } = this.props
    const konnectorJob = new KonnectorJob(client, trigger)
    konnectorJob
      .on(ERROR_EVENT, this.handleError)
      .on(SUCCESS_EVENT, this.handleSuccess)
      .on(TWO_FA_REQUEST_EVENT, this.handleTwoFA)
      .on(TWO_FA_MISMATCH_EVENT, this.handleTwoFA)

    this.setState({
      error: null,
      konnectorJob,
      running: true
    })

    if (typeof onLaunch === 'function') onLaunch(trigger)

    konnectorJob.launch()
  }

  dismissTwoFAModal() {
    // TODO: Make the modal not closable, or offer possibility to re-open it.
    this.setState({ showTwoFAModal: false })
  }

  displayTwoFAModal() {
    this.setState({ showTwoFAModal: true })
  }

  async handleError(error) {
    this.dismissTwoFAModal()
    this.stopWatchingKonnectorJob()
    const trigger = await this.refetchTrigger()
    this.setState({ error, running: false, trigger })
    const { onError } = this.props
    if (typeof onError === 'function') onError(error)
  }

  async handleSuccess() {
    this.dismissTwoFAModal()
    this.stopWatchingKonnectorJob()
    const trigger = await this.refetchTrigger()
    this.setState({ running: false, trigger })
    const { onSuccess } = this.props
    if (typeof onSuccess === 'function') onSuccess(trigger)
  }

  handleTwoFA() {
    this.displayTwoFAModal()
  }

  async refetchTrigger() {
    const { fetchTrigger, trigger } = this.props
    try {
      return await fetchTrigger(trigger._id)
    } catch (error) {
      this.setState({ error, running: false })
      throw error
    }
  }

  stopWatchingKonnectorJob() {
    const { konnectorJob } = this.state
    konnectorJob.unwatch()
  }

  render() {
    const { error, running, showTwoFAModal, trigger } = this.state
    const { children, konnectorJob, submitting } = this.props
    return (
      <div>
        {children({
          error,
          launch: this.launch,
          running: !!running || !!submitting,
          trigger
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
   * CozyClient instance
   */
  client: PropTypes.object.isRequired,
  /**
   * Callback to call when the trigger is launched
   */
  onLaunch: PropTypes.func,
  /**
   * Callback to call when the konnector job succeeds
   */
  onSuccess: PropTypes.func,
  /**
   * Callback to call when the konnector job fails
   */
  onError: PropTypes.func,
  /**
   * Indicates if trigger is already runnning
   */
  submitting: PropTypes.bool,
  /**
   * Trigger to launch
   */
  trigger: PropTypes.object.isRequired
}

export default withLocales(
  withClient(
    withMutations(accountsMutations, triggersMutations)(TriggerLauncher)
  )
)
