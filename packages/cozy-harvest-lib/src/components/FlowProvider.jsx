import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import ConnectionBackdrop from './AccountForm/ConnectionBackdrop'
import TwoFAModal from './TwoFAModal'
import assert from '../assert'
import logger from '../logger'
import ConnectionFlow from '../models/ConnectionFlow'
import {
  ERROR_EVENT,
  SUCCESS_EVENT,
  LOGIN_SUCCESS_EVENT,
  TWO_FA_REQUEST_EVENT,
  TRIGGER_LAUNCH_EVENT,
  UPDATE_EVENT
} from '../models/flowEvents'

/**
 * FlowProvider instantiates a ConnectionFlow and provides it to its children.
 * It will listen to 2FA events and display 2FA modals.
 * It re-renders children when the connectionFlow updates.
 *
 *
 * ### Example
 * ```js
 * <FlowProvider initialTrigger={trigger}>
 *   {({ flow }) => {
 *     const flowState = flow.getState()
 *     return <Button onClick={() => flow.launch()} disabled={running} />
 *    }}
 * </FlowProvider>
 * ```
 */
export class FlowProvider extends Component {
  constructor(props, context) {
    super(props, context)
    const { initialTrigger, konnector } = this.props
    assert(konnector, 'no konnector given to FlowProvider')
    this.state = {
      showTwoFAModal: false
    }

    this.dismissTwoFAModal = this.dismissTwoFAModal.bind(this)
    this.displayTwoFAModal = this.displayTwoFAModal.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this)
    this.handleFlowUpdate = this.handleFlowUpdate.bind(this)

    this.setupConnectionFlow(initialTrigger, konnector)
  }

  setupConnectionFlow(trigger, konnector) {
    const { client } = this.props
    this.flow = new ConnectionFlow(client, trigger, konnector)
    this.flow
      .on(ERROR_EVENT, this.handleError)
      .on(SUCCESS_EVENT, this.handleSuccess)
      .on(TRIGGER_LAUNCH_EVENT, this.handleTriggerLaunch)
      .on(LOGIN_SUCCESS_EVENT, this.handleLoginSuccess)
      .on(TWO_FA_REQUEST_EVENT, this.displayTwoFAModal)
      .on(UPDATE_EVENT, this.handleFlowUpdate)
  }

  handleFlowUpdate() {
    const flowState = this.flow.getState()
    logger.info('FlowProvider: Handle flow update', flowState)
    this.setState({ flowState })
  }

  stopWatchingConnectionFlow() {
    this.flow.removeListener(ERROR_EVENT, this.handleError)
    this.flow.removeListener(SUCCESS_EVENT, this.handleSuccess)
    this.flow.removeListener(TRIGGER_LAUNCH_EVENT, this.handleTriggerLaunch)
    this.flow.removeListener(LOGIN_SUCCESS_EVENT, this.handleLoginSuccess)
    this.flow.removeListener(TWO_FA_REQUEST_EVENT, this.displayTwoFAModal)
    this.flow.removeListener(UPDATE_EVENT, this.handleFlowUpdate)
    this.flow.unwatch()
  }

  componentWillUnmount() {
    this.stopWatchingConnectionFlow()
  }

  handleTriggerLaunch(trigger) {
    logger.info('FlowProvider: Dismissing two fa modal')
    const { onLaunch } = this.props
    if (typeof onLaunch === 'function') onLaunch(trigger)
  }

  dismissTwoFAModal() {
    logger.info('FlowProvider: Dismissing two fa modal')
    this.setState({ showTwoFAModal: false })
  }

  displayTwoFAModal() {
    logger.info('FlowProvider: Show two fa modal')
    this.setState({ showTwoFAModal: true })
  }

  handleError(error) {
    logger.info('FlowProvider: Handle error')
    if (this.state.showTwoFAModal) {
      this.dismissTwoFAModal()
    }

    const { onError } = this.props
    if (typeof onError === 'function') onError(error)
  }

  /**
   * Passing trigger to the callbacks is required for
   * redirecting to the right route after an account creation.
   *
   * We need to do that on both, `handleSuccess` and `handleLoginSuccess`
   * since we can receive a success before a loginSuccess (since only
   * few konnectors are dealing with loginSuccess)
   *
   */
  handleSuccess() {
    logger.info('FlowProvider: Handle success')
    if (this.state.showTwoFAModal) {
      this.dismissTwoFAModal()
    }
    const { onSuccess } = this.props
    const flow = this.flow
    if (typeof onSuccess === 'function') onSuccess(flow.trigger)
  }

  handleLoginSuccess(accountId) {
    logger.info('FlowProvider: Handle login success')
    if (this.state.showTwoFAModal) {
      this.dismissTwoFAModal()
    }
    const { onLoginSuccess } = this.props
    const flow = this.flow

    // Handlers expect to be passed a trigger, but it is not
    // guaranteed that the trigger is ready when receiving a LOGIN_SUCCESS
    // since it can happen during account creation, and when the account
    // creation is done directly with the provider, the trigger is not yet
    // created, this is why a trigger like object is created here
    const triggerLike = {
      message: {
        // with clisk konnectors, LOGIN_SUCCESS event can trigger before the account creation realtime event
        // and then flow wont have the correct account id yet
        account: accountId || flow.account._id,
        konnector: flow.konnector.slug
      },
      ...flow.trigger
    }
    if (typeof onLoginSuccess === 'function') onLoginSuccess(triggerLike)
  }

  render() {
    const { showTwoFAModal, flowState } = this.state
    const flow = this.flow
    const { children } = this.props
    const showConnectionBackdrop = flowState?.userNeeded

    return (
      <>
        {children({
          flow
        })}

        {showTwoFAModal && (
          <TwoFAModal
            flow={flow}
            dismissAction={this.dismissTwoFAModal}
            into="coz-harvest-modal-place"
          />
        )}

        {showConnectionBackdrop && (
          <ConnectionBackdrop name={flow.konnector.name} />
        )}
      </>
    )
  }
}

FlowProvider.propTypes = {
  /**
   * Mandatory for render prop
   */
  children: PropTypes.func.isRequired,
  /**
   * CozyClient instance
   */
  client: PropTypes.object.isRequired,
  /**
   * Konnector manifest
   */
  konnector: PropTypes.object,
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
   * Optional trigger in its initial state
   */
  initialTrigger: PropTypes.object
}

export default translate()(withClient(FlowProvider))
