import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withClient, withMutations } from 'cozy-client'

import TwoFAModal from './TwoFAModal'
import { accountsMutations } from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'
import withLocales from './hoc/withLocales'
import triggers from '../helpers/triggers'

import KonnectorJob, {
  ERROR_EVENT,
  SUCCESS_EVENT,
  LOGIN_SUCCESS_EVENT,
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
 * <TriggerLauncher initialTrigger={trigger}>
 *   {(launch, running, trigger) => (
 *     <Button onClick={() => launch(trigger)} disabled={running} />
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
    const { initialTrigger } = this.props
    this.state = {
      showTwoFAModal: false,
      trigger: initialTrigger,
      error: triggers.getError(initialTrigger)
    }

    this.handleTwoFA = this.handleTwoFA.bind(this)
    this.handleTwoFACode = this.handleTwoFACode.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this)

    this.launch = this.launch.bind(this)
  }

  launch(trigger) {
    const { client, onLaunch } = this.props
    this.konnectorJob = new KonnectorJob(client, trigger)
    this.konnectorJob
      .on(ERROR_EVENT, this.handleError)
      .on(SUCCESS_EVENT, this.handleSuccess)
      .on(LOGIN_SUCCESS_EVENT, this.handleLoginSuccess)
      .on(TWO_FA_REQUEST_EVENT, this.handleTwoFA)
      .on(TWO_FA_MISMATCH_EVENT, this.handleTwoFA)

    this.setState({
      error: null,
      running: true,
      trigger
    })

    if (typeof onLaunch === 'function') onLaunch(trigger)

    this.konnectorJob.launch()
  }

  dismissTwoFAModal() {
    // TODO: Make the modal not closable, or offer possibility to re-open it.
    this.setState({ showTwoFAModal: false })
  }

  displayTwoFAModal() {
    this.setState({ showTwoFAModal: true })
  }

  async handleError(error) {
    if (this.state.showTwoFAModal) {
      this.dismissTwoFAModal()
    }
    this.stopWatchingKonnectorJob()
    const trigger = await this.refetchTrigger()
    this.setState({ error, running: false, trigger })
    const { onError } = this.props
    if (typeof onError === 'function') onError(error)
  }

  async handleSuccess() {
    if (this.state.showTwoFAModal) {
      this.dismissTwoFAModal()
    }
    this.stopWatchingKonnectorJob()
    const trigger = await this.refetchTrigger()
    this.setState({ running: false, trigger })
    const { onSuccess } = this.props
    if (typeof onSuccess === 'function') onSuccess(trigger)
  }

  async handleLoginSuccess() {
    this.dismissTwoFAModal()
    const { onLoginSuccess } = this.props
    if (typeof onLoginSuccess === 'function') onLoginSuccess()
  }

  handleTwoFA() {
    this.displayTwoFAModal()
  }

  async handleTwoFACode(code) {
    this.setState({ isSubmittingTwoFA: true })
    return this.konnectorJob.sendTwoFACode(code)
  }

  async refetchTrigger() {
    const { fetchTrigger } = this.props
    const { trigger } = this.state
    try {
      return await fetchTrigger(trigger._id)
    } catch (error) {
      this.setState({ error, running: false })
      throw error
    }
  }

  stopWatchingKonnectorJob() {
    this.konnectorJob.unwatch()
    delete this.konnectorJob
  }

  render() {
    const { error, running, showTwoFAModal, trigger } = this.state
    const { children, submitting } = this.props
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
            dismissAction={this.dismissTwoFAModal}
            into="coz-harvest-modal-place"
            konnectorSlug={triggers.getKonnectorSlug(trigger)}
            hasFailed={this.konnectorJob.isTwoFARetry()}
            isSubmitting={this.konnectorJob.isTwoFARunning()}
            onTwoFACodeSubmit={this.handleTwoFACode}
            provider={this.konnectorJob.getTwoFACodeProvider()}
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
   * Callback to call when the konnector is logged in
   */
  onLoginSuccess: PropTypes.func,
  /**
   * Callback to call when the konnector job fails
   */
  onError: PropTypes.func,
  /**
   * Indicates if trigger is already runnning.
   * Useful at the initial render of the page when we know a job is already running.
   */
  submitting: PropTypes.bool,
  /**
   * Optionnal trigger in its initial state
   */
  initialTrigger: PropTypes.object
}

export default withLocales(
  withClient(
    withMutations(accountsMutations, triggersMutations)(TriggerLauncher)
  )
)
