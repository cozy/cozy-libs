import uuid from 'uuid/v4'

import * as konnectors from './konnectors'
import CozyClient from 'cozy-client'
import CozyRealtime from 'cozy-realtime'

export const OAUTH_REALTIME_CHANNEL = 'oauth-popup'

/**
 * Checks that the given data for the given konnector is consistent with the
 * information stored in localStorage in prepareOAuth method.
 * @param  {Object} konnector
 * @return {Object} response.oAuthUrl -  URL of cozy stack OAuth endpoint
 * @return {Object} response.oAuthStateKey -  Random key saved in localStorage
 * @return {boolean} `true` if data is consistent and OAuth workflow can
 * be validated, `false` otherwise
 */
export const checkOAuthData = (konnector, data) => {
  if (!data) return false

  const { key, oAuthStateKey } = data
  if (!key || !oAuthStateKey) return false

  const accountType = konnectors.getAccountType(konnector)

  const state =
    localStorage.getItem(oAuthStateKey) &&
    JSON.parse(localStorage.getItem(oAuthStateKey))

  return state.accountType === accountType
}

/**
 * Handler to be called at the top level of an application.
 * Aimed to handle an OAuth redirect with data in query string.
 * @param  {Object} options.client (optional) : cozy-client instance which will be used to create
 * cozy-realtime instance if not specified
 * @param  {Object} options.realtime (optional) : cozy-realtime instance used to notify the
 * resulting accountId to the origin harvest window after OAuth redirect
 *
 * We are supposed here to be in the OAuth popup, at the end of the process.
 *
 * We first check that we are actually getting the response we were expecting
 * for, and then we sent the account Id with postMessage
 *
 * This handler should be typically used in the OAuth popup the following way:
 * ```js
 * document.addEventListener('DOMContentLoaded', handleOAuthResponse)
 * ```
 * @return {boolean} `true` if an OAuth response has been handled, `false` otherwise
 */
export const handleOAuthResponse = (options = {}) => {
  let realtime = options.realtime
  if (!realtime) {
    let client = options.client
    if (!client) {
      const root = document.querySelector('[role=application]')
      client = new CozyClient({
        uri: `${window.location.protocol}//${root.dataset.cozyDomain}`,
        token: root.dataset.cozyToken
      })
    }
    realtime = new CozyRealtime({ client })
  }

  /* global URLSearchParams */
  const queryParams = new URLSearchParams(window.location.search)

  const accountId = queryParams.get('account')
  if (!accountId) return false

  /**
   * Key for localStorage, used at the beginning of the OAuth process to store
   * data about the account currently created, and used at the end to check
   * that data are the ones we are expecting.
   */
  const oAuthStateKey = queryParams.get('state')
  if (!oAuthStateKey) return false

  realtime.sendNotification('io.cozy.accounts', OAUTH_REALTIME_CHANNEL, {
    key: accountId,
    oAuthStateKey
  })

  return true
}

/**
 * Generate oauth popup url
 * @param  {string} cozyUrl cozy url
 * @param  {string} accountType connector slug
 * @param  {string} oAuthStateKey localStorage key
 * @param  {Object} oAuthConf connector manifest oauth configuration
 * @param  {string} redirectSlug The app we want to redirect the user on after the end of the flow
 * @param  {string} nonce unique nonce string
 */
export const getOAuthUrl = ({
  cozyUrl,
  accountType,
  oAuthStateKey,
  oAuthConf,
  nonce,
  redirectSlug
}) => {
  let oAuthUrl = `${cozyUrl}/accounts/${accountType}/start?state=${oAuthStateKey}&nonce=${nonce}`
  if (
    oAuthConf.scope !== undefined &&
    oAuthConf.scope !== null &&
    oAuthConf.scope !== false
  ) {
    const urlScope = Array.isArray(oAuthConf.scope)
      ? oAuthConf.scope.join('+')
      : oAuthConf.scope
    oAuthUrl += `&scope=${urlScope}`
  }
  if (redirectSlug) {
    oAuthUrl += `&slug=${redirectSlug}`
  }
  return oAuthUrl
}

/**
 * Initializes client OAuth workflow by storing the current information about
 * account type in localStorage. Generates the OAuth URL to stack endpoint,
 * passing the localStorage key as state in query string.
 * @param  {string} domain    Cozy domain
 * @param  {Object} konnector
 * @param  {string} redirectSlug The app we want to redirect the user on after the end of the flow
 * @return {Object}           Object containing: `oAuthUrl` (URL of cozy stack
 * OAuth endpoint) and `oAuthStateKey` (localStorage key)
 */
export const prepareOAuth = (client, konnector, redirectSlug) => {
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
    nonce: Date.now(),
    redirectSlug
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
