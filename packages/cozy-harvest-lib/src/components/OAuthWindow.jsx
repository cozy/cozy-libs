// @ts-check
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { withClient } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import CozyRealtime from 'cozy-realtime'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import InAppBrowser from './InAppBrowser'
import Popup from './Popup'
import {
  prepareOAuth,
  checkOAuthData,
  terminateOAuth,
  OAUTH_REALTIME_CHANNEL
} from '../helpers/oauth'
// TODO use PopUp from cozy-ui
import { intentsApiProptype } from '../helpers/proptypes'
import logger from '../logger'

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
    const {
      client,
      konnector,
      redirectSlug,
      extraParams,
      reconnect = false,
      manage = false,
      account
    } = this.props
    this.realtime = new CozyRealtime({ client })
    this.realtime.subscribe(
      'notified',
      'io.cozy.accounts',
      OAUTH_REALTIME_CHANNEL,
      this.handleMessage
    )
    const { oAuthStateKey, oAuthUrl } = prepareOAuth({
      client,
      konnector,
      redirectSlug,
      extraParams,
      reconnect,
      manage,
      account
    })
    this.setState({ oAuthStateKey, oAuthUrl, succeed: false })
  }

  componentWillUnmount() {
    const { oAuthStateKey } = this.state
    if (oAuthStateKey) {
      terminateOAuth(oAuthStateKey)
    }
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
   *
   * @param  {OAuthData} data
   */
  handleOAuthData(data) {
    const { konnector, onSuccess, onCancel } = this.props
    if (!checkOAuthData(konnector, data)) return

    if (data.error) {
      logger.info('OAuthWindow: oauth error message', data.error)
      if (onCancel) {
        onCancel(data.error)
      }
      return
    }
    this.setState({ succeed: true })

    if (typeof onSuccess !== 'function') return
    onSuccess(data.key, data)
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
    const oAuthData = extractOAuthDataFromUrl(url)
    if (oAuthData) {
      return this.handleOAuthData(oAuthData)
    }
    const redirect = url.searchParams.get('redirect')
    if (redirect) {
      const redirectOAuthData = extractOAuthDataFromUrl(new URL(redirect))
      if (redirectOAuthData) {
        return this.handleOAuthData(redirectOAuthData)
      }
    }
  }

  render() {
    const { t, intentsApi } = this.props
    const { oAuthUrl } = this.state
    return (
      oAuthUrl &&
      (!isFlagshipApp() && !intentsApi ? (
        <Popup
          url={oAuthUrl}
          height={OAUTH_POPUP_HEIGHT}
          width={OAUTH_POPUP_WIDTH}
          onClose={this.handleClose}
          onUrlChange={this.handleUrlChange}
          title={t(`oauth.window.title`)}
        />
      ) : (
        <InAppBrowser
          url={oAuthUrl}
          onClose={this.handleClose}
          intentsApi={intentsApi}
        />
      ))
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
  redirectSlug: PropTypes.string,
  /** Is it a reconnection or not */
  reconnect: PropTypes.bool,
  /** Are we trying to edit an existing account (without reconnection) */
  manage: PropTypes.bool,
  /** Existing account */
  account: PropTypes.object,
  /** custom intents api. Can have fetchSessionCode, showInAppBrowser, closeInAppBrowser at the moment */
  intentsApi: intentsApiProptype
}

/**
 * @typedef OAuthData
 * @property  {String} key - `io.cozy.accounts` id The created OAuth account
 * @property  {String} [error] - error message
 * @property  {String} oAuthStateKey - key for localStorage
 */

/**
 * Extract OAuthData from url search params if any
 *
 * @param {URL} url
 * @returns {OAuthData|null} OAuthData
 */
function extractOAuthDataFromUrl(url) {
  const account = url.searchParams.get('account')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  if (account && state) {
    const oAuthData = { key: account, oAuthStateKey: state }
    if (error) {
      oAuthData.error = error
    }
    return oAuthData
  }
  return null
}

// @ts-ignore L'argument de type 'typeof OAuthWindow' n'est pas attribuable au paramètre de type 'Component<{}, {}, any>' ?
export default translate()(withClient(OAuthWindow))
