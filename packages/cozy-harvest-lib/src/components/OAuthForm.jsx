import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import OAuthWindow from './OAuthWindow'
import compose from 'lodash/flowRight'
import withConnectionFlow from '../models/withConnectionFlow'

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
    this.state = {
      initialValues: null,
      showingOAuthModal: false
    }
  }

  componentDidMount() {
    const { account } = this.props
    this.setState({ initialValues: account ? account.oauth : null })
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
    const { konnector, t, flowState } = this.props
    const { initialValues, showOAuthWindow } = this.state
    const isBusy = showOAuthWindow === true || flowState.running

    return initialValues ? null : (
      <>
        <Button
          className="u-mt-1"
          busy={isBusy}
          disabled={isBusy}
          extension="full"
          label={t('oauth.connect.label')}
          onClick={this.handleConnect}
        />
        {showOAuthWindow && (
          <OAuthWindow
            konnector={konnector}
            onSuccess={this.handleAccountId}
            onCancel={this.handleOAuthCancel}
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
  t: PropTypes.func.isRequired
}

export default compose(
  translate(),
  withConnectionFlow()
)(OAuthForm)
