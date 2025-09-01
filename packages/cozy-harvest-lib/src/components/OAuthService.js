// @ts-check
import { isFlagshipApp } from 'cozy-device-helper'

import { openWindow } from './PopupService'
import {
  prepareOAuth,
  checkOAuthData,
  terminateOAuth,
  OAUTH_REALTIME_CHANNEL
} from '../helpers/oauth'
import logger from '../logger'

const OAUTH_POPUP_HEIGHT = 800
const OAUTH_POPUP_WIDTH = 800

export const OAUTH_SERVICE_CLOSED = 'CLOSED'
export const OAUTH_SERVICE_ERROR = 'ERROR'
export const OAUTH_SERVICE_OK = 'OK'

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
    result: OAUTH_SERVICE_OK,
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
 * @typedef OAuthServiceResult
 * @property {"OK"|"CLOSED"|"ERROR"} result
 * @property {String} [error]
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
          resolve({ result: OAUTH_SERVICE_ERROR, error: result })
          return
        }

        webviewIntent.call('closeInAppBrowser')
        resolve({ result: OAUTH_SERVICE_CLOSED })
        return
      } catch (err) {
        webviewIntent.call('closeInAppBrowser')
        resolve({ result: OAUTH_SERVICE_ERROR, error: err })
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
          return resolve({ result: OAUTH_SERVICE_ERROR, error: result })
        }
        return resolve({ result: OAUTH_SERVICE_CLOSED })
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
    const handler = handleRealtime(konnector, resolve)
    realtime.subscribe(
      'notified',
      'io.cozy.accounts',
      OAUTH_REALTIME_CHANNEL,
      handler
    )
    return () =>
      realtime.unsubscribe(
        'notified',
        'io.cozy.accounts',
        OAUTH_REALTIME_CHANNEL,
        handler
      )
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
      registerRealtime: registerRealtime({ konnector, client })
    })
  }

  return promise.then(result => {
    terminateOAuth(oAuthStateKey)
    return result
  })
}
