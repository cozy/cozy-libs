// @ts-check
import uuid from 'uuid/v4'
import get from 'lodash/get'

import CozyClient from 'cozy-client'
import CozyRealtime from 'cozy-realtime'
import { readCozyDataFromDOM } from 'cozy-ui/transpiled/react/helpers/appDataset'

import * as konnectors from './konnectors'

export const OAUTH_REALTIME_CHANNEL = 'oauth-popup'

/**
 * Checks that the given data for the given konnector is consistent with the
 * information stored in localStorage in prepareOAuth method.
 * @param  {Object} konnector
 * @param  {import('../components/OAuthWindow').OAuthData} data
 * @return {boolean} `true` if data is consistent and OAuth workflow can
 * be validated, `false` otherwise
 */
export const checkOAuthData = (konnector, data) => {
  if (!data) return false

  const { oAuthStateKey } = data
  if (!oAuthStateKey) return false

  const accountType = konnectors.getAccountType(konnector)

  const item = localStorage.getItem(oAuthStateKey)
  const state = item && JSON.parse(item)

  return state.accountType === accountType
}

/**
 * Handler to be called at the top level of an application.
 * Aimed to handle an OAuth redirect with data in query string.
 * @param  {Object} options
 * @param  {Object} [options.client] - cozy-client instance which will be used to create
 * cozy-realtime instance if not specified
 * @param  {CozyRealtime} [options.realtime] - cozy-realtime instance used to notify the
 * resulting accountId to the origin harvest window after OAuth redirect
 *
 * We are supposed here to be in the OAuth popup or OAuth inAppBrowser, at the end of the process.
 *
 * We first check that we are actually getting the response we were expecting
 * for, and then we sent the account Id with postMessage if any
 *
 * This handler should be typically used in the OAuth popup the following way:
 * ```js
 * document.addEventListener('DOMContentLoaded', handleOAuthResponse)
 * ```
 * @return {boolean} `true` if an OAuth response has been handled, `false` otherwise
 */
export const handleOAuthResponse = options => {
  let realtime = options?.realtime
  if (!realtime) {
    let client = options?.client
    if (!client) {
      const domain = readCozyDataFromDOM('domain')
      const token = readCozyDataFromDOM('token')

      client = new CozyClient({
        uri: `${window.location.protocol}//${domain}`,
        token: token
      })
    }
    realtime = new CozyRealtime({ client })
  }

  // eslint-disable-next-line no-redeclare
  /* global URLSearchParams */
  const queryParams = new URLSearchParams(window.location.search)
  const key = queryParams.get('account')
  const error = queryParams.get('error')

  /**
   * Key for localStorage, used at the beginning of the OAuth process to store
   * data about the account currently created, and used at the end to check
   * that data are the ones we are expecting.
   */
  const oAuthStateKey = queryParams.get('state')
  if (!oAuthStateKey) return false

  realtime.sendNotification('io.cozy.accounts', OAUTH_REALTIME_CHANNEL, {
    finalLocation: queryParams.toString(),
    key,
    error,
    oAuthStateKey
  })

  return true
}

/**
 * Generate oauth popup url
 * @param  {Object} options
 * @param  {String} options.cozyUrl cozy url
 * @param  {String} options.accountType connector slug
 * @param  {String} options.oAuthStateKey localStorage key
 * @param  {Object} options.oAuthConf  connector manifest oauth configuration
 * @param  {String} options.redirectSlug The app we want to redirect the user on after the end of the flow
 * @param  {String} options.nonce unique nonce string
 * @param  {Object} options.extraParams some extra parameters to add to the query string
 * @param  {Boolean} options.reconnect Are we trying to reconnect an existing account ?
 * @param  {Boolean} options.manage Are we trying to manage an existing account ?
 * @param  {IoCozyAccount} options.account targeted account if any
 * @returns {String} final OAuth url string
 */
export const getOAuthUrl = ({
  cozyUrl,
  accountType,
  oAuthStateKey,
  oAuthConf = {},
  nonce,
  redirectSlug,
  extraParams,
  manage,
  reconnect,
  account
}) => {
  let command = 'start'
  if (manage) {
    command = 'manage'
  } else if (reconnect) {
    command = 'reconnect'
  }
  const accountIdParam = reconnect || manage ? account._id + '/' : ''
  const oAuthUrl = new URL(
    `${cozyUrl}/accounts/${accountType}/${accountIdParam}${command}`
  )
  oAuthUrl.searchParams.set('state', oAuthStateKey)
  oAuthUrl.searchParams.set('nonce', nonce)

  if (
    oAuthConf.scope !== undefined &&
    oAuthConf.scope !== null &&
    oAuthConf.scope !== false
  ) {
    const urlScope = Array.isArray(oAuthConf.scope)
      ? oAuthConf.scope.join('%2B')
      : oAuthConf.scope
    oAuthUrl.searchParams.set('scope', urlScope)
  }
  if (redirectSlug) {
    oAuthUrl.searchParams.set('slug', redirectSlug)
  }

  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) =>
      oAuthUrl.searchParams.set(key, value)
    )
  }

  return decodeURIComponent(oAuthUrl.toString())
}

const getAppSlug = client => {
  return get(client, 'appMetadata.slug')
}

/**
 * Initializes client OAuth workflow by storing the current information about
 * account type in localStorage. Generates the OAuth URL to stack endpoint,
 * passing the localStorage key as state in query string.
 * @param  {Object} options
 * @param  {CozyClient} options.client
 * @param  {Object} options.konnector
 * @param  {string} options.redirectSlug The app we want to redirect the user on after the end of the flow
 * @param  {Object} options.extraParams some extra parameters to add to the query string
 * @param  {Boolean} options.reconnect Are we trying to reconnect an existing account ?
 * @param  {Boolean} options.manage Are we trying to manage an existing account ?
 * @param  {IoCozyAccount} options.account targetted account if any
 * @return {Object}           Object containing: `oAuthUrl` (URL of cozy stack OAuth endpoint) and `oAuthStateKey` (localStorage key)
 */
export const prepareOAuth = ({
  client,
  konnector,
  redirectSlug,
  extraParams,
  reconnect = false,
  manage = false,
  account
}) => {
  const { oauth } = konnector
  const accountType = konnectors.getAccountType(konnector)

  // We use localStorage to store the account related data
  // We will later check in localStorage that the received information is
  // consistent.
  const oAuthState = { accountType: konnectors.getAccountType(konnector) }
  const oAuthStateKey = uuid()
  localStorage.setItem(oAuthStateKey, JSON.stringify(oAuthState))

  const cozyUrl = client.stackClient.uri

  const oAuthUrl = getOAuthUrl({
    cozyUrl,
    accountType,
    oAuthStateKey,
    oAuthConf: oauth,
    nonce: String(Date.now()),
    redirectSlug: redirectSlug || getAppSlug(client),
    extraParams,
    reconnect,
    manage,
    account
  })

  return { oAuthStateKey, oAuthUrl }
}

/**
 * Terminates the Client OAuth workflow, i.e. clean the localStorage.
 * @param  {string} oAuthStateKey localStorage key
 */
export const terminateOAuth = oAuthStateKey => {
  localStorage.removeItem(oAuthStateKey)
}

export default {
  checkOAuthData,
  handleOAuthResponse,
  prepareOAuth,
  terminateOAuth,
  getOAuthUrl
}
