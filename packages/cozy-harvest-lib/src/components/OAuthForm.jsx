import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

import OAuthWindow from './OAuthWindow'

const IDLE = 'idle'
const WAITING = 'waiting'

/**
 * The OAuth Form is responsible for displaying a form for OAuth konnectors. It
 * starts the OAuth process
 */
export class OAuthForm extends PureComponent {
  state = {
    initialValues: null,
    status: IDLE
  }

  constructor(props, context) {
    super(props, context)
    this.handleAccountId = this.handleAccountId.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOAuthCancel = this.handleOAuthCancel.bind(this)
  }

  componentDidMount() {
    const { account } = this.props
    this.setState({ initialValues: account ? account.oauth : null })
  }

  endOAuth() {
    this.setState({ status: IDLE })
  }

  startOAuth() {
    this.setState({ status: WAITING })
  }

  handleAccountId(accountId) {
    const { onSuccess } = this.props
    this.endOAuth()
    if (typeof onSuccess === 'function') onSuccess(accountId)
  }

  handleSubmit() {
    this.startOAuth()
  }

  handleOAuthCancel() {
    this.endOAuth()
  }

  render() {
    const { konnector, submitting, t } = this.props
    const { initialValues, status } = this.state
    const isWaiting = status === WAITING
    const isBusy = isWaiting || submitting
    return initialValues ? null : (
      <>
        <Button
          className="u-mt-1"
          busy={isBusy}
          disabled={isBusy}
          extension="full"
          label={t('oauth.connect.label')}
          onClick={this.handleSubmit}
        />
        {isWaiting && (
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
  /** Indicates if the form should be rendered as submitting */
  submitting: PropTypes.bool,
  /** Translation function */
  t: PropTypes.func.isRequired
}

export default translate()(OAuthForm)
