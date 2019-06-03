import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/react/I18n'

import { prepareOAuth, checkOAuthData, terminateOAuth } from '../helpers/oauth'
import Popup from './Popup'

const OAUTH_POPUP_HEIGHT = 800
const OAUTH_POPUP_WIDTH = 800

/**
 * OAuth window is responsible for managing the OAuth process on the client
 * side, storing info into local storage, loading OAuth window and listening
 * for data from it.
 *
 * The goal of our OAuth Workflow is to retrieve an account id.
 *
 * The main part of our OAuth workflow is done by the stack, which redirects
 * to the OAuth provider authentification endpoint, handles redirection, creates
 * account and forwards the id of the created account.
 */
export class OAuthWindow extends PureComponent {
  state = {
    oAuthUrl: null,
    oAuthStateKey: null,
    succeed: false
  }

  constructor(props, context) {
    super(props, context)
    this.handleClose = this.handleClose.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
  }

  componentDidMount() {
    const { client, konnector } = this.props
    const { oAuthStateKey, oAuthUrl } = prepareOAuth(client, konnector)
    this.setState({ oAuthStateKey, oAuthUrl, succeed: false })
  }

  componentWillUnmount() {
    const { oAuthStateKey } = this.state
    terminateOAuth(oAuthStateKey)
  }

  handleClose() {
    const { succeed } = this.state
    if (succeed) return

    const { onCancel } = this.props
    if (typeof onCancel === 'function') onCancel()
  }

  /**
   * Handles OAuth data. OAuth data may be provided by different way:
   * * postMessage from web apps (see handleMessage)
   * * url changes from mobile apps
   * @param  {string} data.key `io.cozy.accounts` id The created OAuth account
   * @param  {string} data.oAuthStateKey key for localStorage
   */
  handleOAuthData(data) {
    const { konnector, onSuccess } = this.props
    if (!checkOAuthData(konnector, data)) return
    this.setState({ succeed: true })

    if (typeof onSuccess !== 'function') return
    this.setState({ succeed: true })
    onSuccess(data.key)
  }

  /**
   * Expects receiving message from web app
   * @param  {MessageEvent} messageEvent
   */
  handleMessage(messageEvent) {
    this.handleOAuthData(messageEvent.data)
  }

  /**
   * Monitor URL changes for mobile apps and in app browsers
   * @param  {URL} url
   */
  handleUrlChange(url) {
    const account = url.searchParams.get('account')
    const state = url.searchParams.get('state')

    this.handleOAuthData({
      key: account,
      oAuthStateKey: state
    })
  }

  render() {
    const { t } = this.props
    const { oAuthUrl, succeed } = this.state
    return (
      oAuthUrl &&
      !succeed && (
        <Popup
          url={oAuthUrl}
          height={OAUTH_POPUP_HEIGHT}
          width={OAUTH_POPUP_WIDTH}
          onMessage={this.handleMessage}
          onClose={this.handleClose}
          onUrlChange={this.handleUrlChange}
          title={t(`oauth.window.title`)}
        />
      )
    )
  }
}

OAuthWindow.propTypes = {
  client: PropTypes.object.isRequired,
  /** Konnector document */
  konnector: PropTypes.object.isRequired,
  /** Callback called when an accout id is obtained at the end of the OAuth
  workflow */
  onSuccess: PropTypes.func,
  /** Callback called when the OAuth window is closed wihout having retrieved
  an account id */
  onCancel: PropTypes.func
}

export default translate()(withClient(OAuthWindow))
