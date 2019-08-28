import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withClient, withMutations } from 'cozy-client'
import CozyRealtime from 'cozy-realtime'

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
    const { initialTrigger, client } = this.props
    this.state = {
      showTwoFAModal: false,
      trigger: initialTrigger,
      error: triggers.getError(initialTrigger)
    }

    this.handleTwoFA = this.handleTwoFA.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this)

    this.launch = this.launch.bind(this)

    this.realtime = new CozyRealtime({ cozyClient: client })
  }

  async handleUpdate(job) {
    console.log('update', job)
    if (this.state.trigger && this.state.trigger._id === job.trigger_id) {
      console.log('this.state', this.state)
      const trigger = await this.refetchTrigger()
      this.setState({
        trigger,
        running: job.state === 'running'
      })
    }
  }
  async componentDidMount() {
    await this.realtime.subscribe(
      'updated',
      'io.cozy.jobs',
      this.handleUpdate.bind(this)
    )
  }
  async componentWillUnmount() {
    await this.realtime.unsubscribeAll()
  }
  launch(trigger) {
    const { client, onLaunch } = this.props
    console.log({ trigger })
    const konnectorJob = new KonnectorJob(client, trigger)
    konnectorJob
      .on(ERROR_EVENT, this.handleError)
      .on(SUCCESS_EVENT, this.handleSuccess)
      .on(LOGIN_SUCCESS_EVENT, this.handleLoginSuccess)
      .on(TWO_FA_REQUEST_EVENT, this.handleTwoFA)
      .on(TWO_FA_MISMATCH_EVENT, this.handleTwoFA)

    this.setState({
      error: null,
      konnectorJob,
      running: true,
      trigger
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

    this.setState({ error })
    const { onError } = this.props
    if (typeof onError === 'function') onError(error)
  }

  async handleSuccess() {
    this.dismissTwoFAModal()
    this.stopWatchingKonnectorJob()
    const { onSuccess } = this.props
    if (typeof onSuccess === 'function') onSuccess()
  }

  async handleLoginSuccess() {
    this.dismissTwoFAModal()
    const { onLoginSuccess } = this.props
    if (typeof onLoginSuccess === 'function') onLoginSuccess()
  }

  handleTwoFA() {
    this.displayTwoFAModal()
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
    const { konnectorJob } = this.state
    konnectorJob.unwatch()
  }

  render() {
    console.log('this.State', this.state)
    console.log('this.props', this.props)
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
