import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import OAuthWindow from './OAuthWindow'
import compose from 'lodash/flowRight'
import withConnectionFlow from '../models/withConnectionFlow'
import { findKonnectorPolicy } from '../konnector-policies'

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
    this.state = {
      showingOAuthModal: false
    }
  }

  componentDidMount() {
    const { account, konnector, flow, client } = this.props

    const konnectorPolicy = findKonnectorPolicy(konnector)

    if (konnectorPolicy.fetchExtraOAuthUrlParams) {
      this.setState({ needExtraParams: true })
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
  }

  handleExtraParams(extraParams) {
    this.setState({ extraParams: extraParams })
  }

  handleAccountId(accountId) {
    const { onSuccess } = this.props
    this.hideOAuthWindow()
    if (typeof onSuccess === 'function') onSuccess(accountId)
  }

  handleConnect() {
    this.showOAuthWindow()
  }

  handleOAuthCancel() {
    this.hideOAuthWindow()
  }

  hideOAuthWindow() {
    this.setState({ showOAuthWindow: false })
  }

  showOAuthWindow() {
    this.setState({ showOAuthWindow: true })
  }

  render() {
    const { konnector, t, flowState, reconnect, account } = this.props
    const { showOAuthWindow, needExtraParams, extraParams } = this.state
    const isBusy =
      showOAuthWindow === true ||
      flowState.running ||
      (needExtraParams && !extraParams)

    const buttonLabel = reconnect ? 'oauth.reconnect.label' : 'oauth.connect.label'

    return (
      <>
        <Button
          className="u-mt-1"
          busy={isBusy}
          disabled={isBusy}
          extension="full"
          label={t(buttonLabel)}
          onClick={this.handleConnect}
        />
        {showOAuthWindow && (
          <OAuthWindow
            extraParams={extraParams}
            konnector={konnector}
            reconnect={reconnect}
            onSuccess={this.handleAccountId}
            onCancel={this.handleOAuthCancel}
            account={account}
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
  reconnect: PropTypes.bool
}

export default compose(translate(), withConnectionFlow())(OAuthForm)
