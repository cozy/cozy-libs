// @ts-check
import { isFlagshipApp } from 'cozy-device-helper'
import {
  prepareOAuth,
  checkOAuthData,
  terminateOAuth,
  OAUTH_REALTIME_CHANNEL
} from '../helpers/oauth'
import logger from '../logger'
import { openWindow } from './PopupService'

const OAUTH_POPUP_HEIGHT = 800
const OAUTH_POPUP_WIDTH = 800

/**
 * Monitor URL changes for mobile apps and in app browsers
 * @param  {import('cozy-client/types/types').KonnectorsDoctype} konnector
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
function handleUrlChange(konnector) {
  return resolve => {
    return event => {
      const { url } = event
      const oAuthData = extractOAuthDataFromUrl(url)
      if (oAuthData) {
        return handleOAuthData(oAuthData, konnector, resolve)
      }
      const redirect = url.searchParams.get('redirect')
      if (redirect) {
        const redirectOAuthData = extractOAuthDataFromUrl(new URL(redirect))
        if (redirectOAuthData) {
          return handleOAuthData(redirectOAuthData, konnector, resolve)
        }
      }
    }
  }
}

/**
 * Handles OAuth data. OAuth data may be provided by different way:
 * * realtime message from web apps (see handleMessage)
 * * url changes from mobile apps
 *
 * @param {OAuthData} data
 * @param {import('cozy-client/types/types').KonnectorsDoctype} konnector
 * @param {Function} resolve - function which will resolve the openOAuthWindow promise
 * @returns <void>
 */
function handleOAuthData(data, konnector, resolve) {
  if (!checkOAuthData(konnector, data)) return

  if (data.error) {
    logger.info('OAuthWindow: oauth error message', data.error)
    resolve({
      result: 'CANCEL',
      error: data.error
    })
    return
  }

  resolve({
    result: 'OK',
    key: data.key,
    data
  })
}

/**
 * @typedef OAuthData
 * @property  {String} key - `io.cozy.accounts` id The created OAuth account
 * @property  {String} [error] - error message
 * @property  {String} oAuthStateKey - key for localStorage
 * @property  {String} [finalLocation] - final query string added to the redirected url
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

/**
 * @typedef OAuthServiceResult
 * @property {"OK"|"CLOSED"|"DISMISSED"|"ERROR"} result
 * @property {OAuthData} [data]
 */

/**
 * Opens given url in the webview intent inAppBrowser
 *
 * @param {Object} options
 * @param {String} options.oAuthUrl - final url to open in webview intent inAppBrowser
 * @param {import('cozy-intent').WebviewService} options.webviewIntent - WebviewService object to use
 * @param {Function} options.registerRealtime
 * @returns {Promise<OAuthServiceResult>}
 */
async function openWebviewIntentInAppBrowser({
  oAuthUrl,
  webviewIntent,
  registerRealtime
}) {
  return new Promise((resolve, reject) => {
    const doExec = async () => {
      if (!webviewIntent) {
        return reject('No webviewIntent available')
      }

      try {
        registerRealtime(data => {
          webviewIntent.call('closeInAppBrowser')
          return resolve(data)
        })
        logger.debug('url at the beginning: ', oAuthUrl)
        const sessionCode = await webviewIntent.call('fetchSessionCode')
        logger.debug('got session code', sessionCode)
        const iabUrl = new URL(oAuthUrl)
        // @ts-ignore wrong return type associated to webviewIntent.call
        iabUrl.searchParams.append('session_code', sessionCode)
        // we need to decodeURIComponent since toString() encodes URL
        // but native browser will also encode them.
        const urlToOpen = decodeURIComponent(iabUrl.toString())
        logger.debug('url to open: ', urlToOpen)
        const result = await webviewIntent.call('showInAppBrowser', {
          url: urlToOpen
        })
        // @ts-ignore wrong return type associated to webviewIntent.call
        if (result?.type !== 'dismiss' && result?.type !== 'cancel') {
          // @ts-ignore wrong return type associated to webviewIntent.call
          resolve({ result: 'ERROR', error: result })
          return
        }

        webviewIntent.call('closeInAppBrowser')
        resolve({ result: 'CLOSED' })
        return
      } catch (err) {
        webviewIntent.call('closeInAppBrowser')
        resolve({ result: 'ERROR', error: err })
        return
      }
    }
    doExec()
  })
}

/**
 * @typedef IntentsApi
 * @property {Function} fetchSessionCode
 * @property {Function} showInAppBrowser
 * @property {Function} closeInAppBrowser
 * @property {String} tokenParamName
 */

/**
 * Opens given url in the intentsApi inAppBrowser
 *
 * @param {Object} options
 * @param {String} options.oAuthUrl - final url to open in the intentsApi inAppBrowser
 * @param {IntentsApi} options.intentsApi - WebviewService object to use
 * @param {Function} options.registerRealtime
 * @returns {Promise<OAuthServiceResult>}
 */
function openIntentsApiInAppBrowser({
  oAuthUrl,
  registerRealtime,
  intentsApi
}) {
  return new Promise((resolve, reject) => {
    const doExec = async () => {
      const {
        fetchSessionCode,
        showInAppBrowser,
        closeInAppBrowser,
        tokenParamName = 'session_code'
      } = intentsApi

      const isReady = Boolean(
        intentsApi?.fetchSessionCode &&
          intentsApi?.showInAppBrowser &&
          intentsApi?.closeInAppBrowser
      )

      if (!isReady) {
        return reject('Missing method in intentsApi')
      }
      try {
        registerRealtime(data => {
          closeInAppBrowser()
          return resolve(data)
        })
        const sessionCode = await fetchSessionCode()
        logger.debug('got session code', sessionCode)
        const iabUrl = new URL(oAuthUrl)
        iabUrl.searchParams.append(tokenParamName, sessionCode)
        // we need to decodeURIComponent since toString() encodes URL
        // but native browser will also encode them.
        const urlToOpen = decodeURIComponent(iabUrl.toString())
        logger.debug('url to open: ', urlToOpen)
        const result = await showInAppBrowser(urlToOpen)
        if (result?.state !== 'dismiss' && result?.state !== 'cancel') {
          return resolve({ result: 'ERROR', error: result })
        }
        return resolve({ result: 'CLOSED' })
      } catch (err) {
        return resolve({ result: 'ERROR', error: err })
      }
    }
    doExec()
  })
}

/**
 * Register to realtime events
 *
 * @param {Object} options
 * @param {Object} options.client
 * @param {import('cozy-client/types/types').KonnectorsDoctype} options.konnector
 * @returns  {Function}
 */
function registerRealtime({ client, konnector }) {
  return resolve => {
    const realtime = client.plugins.realtime
    realtime.subscribe(
      'notified',
      'io.cozy.accounts',
      OAUTH_REALTIME_CHANNEL,
      handleRealtime(konnector, resolve)
    )
    return () => realtime.unsubscribeAll()
  }
}

function handleRealtime(konnector, resolve) {
  return event => {
    return handleOAuthData(event.data, konnector, resolve)
  }
}

/**
 * Open an OAuth window in popup or inAppBrowser
 *
 * @param {Object} options
 * @param {Object} options.client - CozyClient instance
 * @param {import('cozy-client/types/types').KonnectorsDoctype} options.konnector - current manifest of the connector
 * @param {String}  [options.redirectSlug] - slug of the app to redirect to after OAuth
 * @param {Object} options.extraParams - any extra parameters to pass in the oauth url
 * @param {Boolean} [options.reconnect] - if this is a reconnection or not
 * @param {Boolean} [options.manage] - if we try to manage an existing oauth connection
 * @param {String} [options.title] - title of the resulting popup
 * @param {import('cozy-intent').WebviewService} [options.webviewIntent] - WebviewService object to use
 * @param {import('cozy-client/types/types').AccountsDoctype} options.account - associated account (useful if in reconnection or manage mode)
 * @param {IntentsApi} options.intentsApi - Intentsapi object to use to communicate with the host native application
 * @returns {Promise<OAuthServiceResult>}
 */
export function openOAuthWindow({
  client,
  konnector,
  redirectSlug,
  extraParams,
  reconnect,
  manage,
  title,
  webviewIntent,
  account,
  intentsApi
}) {
  const { oAuthStateKey, oAuthUrl } = prepareOAuth({
    client,
    konnector,
    redirectSlug,
    extraParams,
    reconnect,
    manage,
    account
  })

  let promise
  if (intentsApi) {
    promise = openIntentsApiInAppBrowser({
      oAuthUrl,
      intentsApi,
      registerRealtime: registerRealtime({ konnector, client })
    })
  } else if (isFlagshipApp() && webviewIntent) {
    promise = openWebviewIntentInAppBrowser({
      oAuthUrl,
      webviewIntent,
      registerRealtime: registerRealtime({ konnector, client })
    })
  } else {
    promise = openWindow({
      url: oAuthUrl,
      title: title || '',
      width: OAUTH_POPUP_WIDTH,
      height: OAUTH_POPUP_HEIGHT,
      handleUrlChange: handleUrlChange(konnector),
      registerRealtime: registerRealtime({ konnector, client })
    })
  }

  return promise.then(result => {
    terminateOAuth(oAuthStateKey)
    return result
  })
}
