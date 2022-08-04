import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import OAuthWindow from './OAuthWindow'
import compose from 'lodash/flowRight'
import withConnectionFlow from '../models/withConnectionFlow'
import withLocales from './hoc/withLocales'
import { findKonnectorPolicy } from '../konnector-policies'
import { intentsApiProptype } from '../helpers/proptypes'
import TriggerErrorInfo from './infos/TriggerErrorInfo'
import { ERROR_EVENT, LOGIN_SUCCESS_EVENT } from '../models/flowEvents'
import { KonnectorJobError } from '../helpers/konnectors'

/**
 * The OAuth Form is responsible for displaying a form for OAuth konnectors. It
 * starts the OAuth process
 */
export class OAuthForm extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.handleAccountId = this.handleAccountId.bind(this)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleOAuthCancel = this.handleOAuthCancel.bind(this)
    this.handleExtraParams = this.handleExtraParams.bind(this)
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this)
    this.state = {}
  }

  componentDidMount() {
    const { account, konnector, flow, client, reconnect } = this.props

    const konnectorPolicy = findKonnectorPolicy(konnector)

    if (konnectorPolicy.fetchExtraOAuthUrlParams) {
      this.setState({ needExtraParams: true })
      if (reconnect) {
        this.showOAuthWindow()
      }
      // eslint-disable-next-line promise/catch-or-return
      konnectorPolicy
        .fetchExtraOAuthUrlParams({
          flow,
          account,
          konnector,
          client
        })
        .then(this.handleExtraParams)
    }
    flow.on(LOGIN_SUCCESS_EVENT, this.handleLoginSuccess)
  }

  handleLoginSuccess() {
    this.hideOAuthWindow()
  }

  handleExtraParams(extraParams) {
    this.setState({ extraParams: extraParams })
  }

  handleAccountId(accountId) {
    const { onSuccess } = this.props
    if (typeof onSuccess === 'function') onSuccess(accountId)
  }

  handleConnect() {
    this.showOAuthWindow()
  }

  componentWillUnmount() {
    const { flow } = this.props
    flow.removeListener(LOGIN_SUCCESS_EVENT, this.handleLoginSuccess)
  }

  /**
   *  Translates errors from oauth redirection url to harvest know error messages
   *
   * @param {String} err - original error message in redirection url
   * @returns {KonnectorJobError|String}
   */
  translateOauthError(err) {
    if (err === 'access_denied') {
      return new KonnectorJobError('OAUTH_CANCELED')
    } else {
      return err
    }
  }

  handleOAuthCancel(err) {
    this.props.flow.triggerEvent(ERROR_EVENT, this.translateOauthError(err))
    this.hideOAuthWindow()
  }

  hideOAuthWindow() {
    this.setState({ showOAuthWindow: false })
  }

  showOAuthWindow() {
    this.setState({ showOAuthWindow: true })
  }

  render() {
    const { konnector, t, flowState, reconnect, account, intentsApi } =
      this.props
    const { showOAuthWindow, needExtraParams, extraParams } = this.state

    const error = flowState.error

    const isBusy =
      showOAuthWindow === true ||
      flowState.running ||
      (needExtraParams && !extraParams)
    const isBankingKonnector = konnector.categories?.includes('banking')
    const buttonLabel = reconnect
      ? isBankingKonnector
        ? 'oauth.banking.reconnect.label'
        : 'oauth.reconnect.label'
      : isBankingKonnector
      ? 'oauth.banking.connect.label'
      : 'oauth.connect.label'

    return (
      <>
        {error && (
          <TriggerErrorInfo
            className="u-mb-1"
            error={error}
            konnector={konnector}
          />
        )}
        {!reconnect && (
          <Button
            className="u-mt-1"
            busy={isBusy}
            disabled={isBusy}
            extension="full"
            label={t(buttonLabel)}
            onClick={this.handleConnect}
          />
        )}
        {showOAuthWindow && extraParams && (
          <OAuthWindow
            extraParams={extraParams}
            konnector={konnector}
            reconnect={reconnect}
            onSuccess={this.handleAccountId}
            onCancel={this.handleOAuthCancel}
            account={account}
            intentsApi={intentsApi}
          />
        )}
      </>
    )
  }
}

OAuthForm.propTypes = {
  /** Existing account */
  account: PropTypes.object,
  /** Related Konnector */
  konnector: PropTypes.object.isRequired,
  /** Success callback, takes account as parameter */
  onSuccess: PropTypes.func,
  /** Translation function */
  t: PropTypes.func.isRequired,
  /** Is it a reconnection or not */
  reconnect: PropTypes.bool,
  /** custom intents api. Can have fetchSessionCode, showInAppBrowser, closeInAppBrowser at the moment */
  intentsApi: intentsApiProptype
}

export default compose(withLocales, withConnectionFlow())(OAuthForm)
