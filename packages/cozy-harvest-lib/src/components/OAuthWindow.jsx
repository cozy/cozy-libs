import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import CozyRealtime from 'cozy-realtime'

import {
  prepareOAuth,
  checkOAuthData,
  terminateOAuth,
  OAUTH_REALTIME_CHANNEL
} from '../helpers/oauth'
//TODO use PopUp from cozy-ui
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
    const { client, konnector, redirectSlug } = this.props
    this.realtime = new CozyRealtime({ client })
    this.realtime.subscribe(
      'notified',
      'io.cozy.accounts',
      OAUTH_REALTIME_CHANNEL,
      this.handleMessage
    )
    const { oAuthStateKey, oAuthUrl } = prepareOAuth(
      client,
      konnector,
      redirectSlug
    )
    this.setState({ oAuthStateKey, oAuthUrl, succeed: false })
  }

  componentWillUnmount() {
    const { oAuthStateKey } = this.state
    terminateOAuth(oAuthStateKey)
    this.realtime.unsubscribeAll()
  }

  handleClose() {
    const { succeed } = this.state
    if (succeed) return

    const { onCancel } = this.props
    if (typeof onCancel === 'function') onCancel()
  }

  /**
   * Handles OAuth data. OAuth data may be provided by different way:
   * * realtime message from web apps (see handleMessage)
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
   *
   * The provider redirect us to something like : oauthcallback.mycozy.cloud/?account=A&state=b
   * So we listen to the URL change with these informations, and we try to handle it.
   * It works well on iOS or when we are logged on the same device on the web, but it will
   * fail on Android if we're ne logged in the browser. Why ?
   * Our oauthcallback.mycozy.cloud/?account=A&state=b checks if we're logged, if not the server
   * sends an http redirect.
   * On Android, the 'loadstart' event is not dispatched by the browser when it get a redirect.
   * The inAppBrowser follows the URL and arrive on :
   * https://my.mycozy.cloud/auth?redirect=https://home.cozy.cloud/?account=a&state=b
   * So if we don't have account & state searchParams we have to check if we've a redirect searchParams
   * init it and search if we have inside this url an account and state params
   */
  handleUrlChange(url) {
    const account = url.searchParams.get('account')
    const state = url.searchParams.get('state')
    if (account && state) {
      return this.handleOAuthData({
        key: account,
        oAuthStateKey: state
      })
    }
    const redirect = url.searchParams.get('redirect')
    if (redirect) {
      const testedURL = new URL(redirect)
      const accountInRedirect = testedURL.searchParams.get('account')
      const stateInRedirect = testedURL.searchParams.get('state')
      return this.handleOAuthData({
        key: accountInRedirect,
        oAuthStateKey: stateInRedirect
      })
    }
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
  onCancel: PropTypes.func,
  /** The app we want to redirect the user on, after the OAuth flow. It used by the stack */
  redirectSlug: PropTypes.string
}

export default translate()(withClient(OAuthWindow))
