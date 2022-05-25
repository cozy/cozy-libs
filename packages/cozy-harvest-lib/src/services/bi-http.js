/**
 * HTTP helpers to talk with Budget-Insight
 *
 * This is a subset of what is available in the konnector. It
 * might make sense to mutualize the code under a bi-sdk package if
 * we ever need more of it here.
 *
 * See https://github.com/cozy/cozy-libs/pull/929#discussion_r372238690
 */

import assert from '../assert'
import logger from '../logger'

const softJSONParse = maybeJSONData => {
  try {
    return JSON.parse(maybeJSONData)
  } catch (e) {
    return maybeJSONData
  }
}

/**
 * @typedef {Object} BIConfig
 * @priority {string} url
 */

/**
 * Handles BI HTTP Error
 *
 * - "code" attribute: wrongpass, actionNeeded etc..
 */
export class BIError extends Error {
  constructor(message) {
    super(message)
    const error = softJSONParse(message)
    if (typeof error === 'object') {
      this.code = error.code || 'NO_CODE'
      this.message = error.message || 'NO_MESSAGE'
    } else {
      this.message = error
    }
  }
}

/**
 * Sends BI request and parses the response
 * Handles authentication and form serializing
 *
 * @throws {BIError}
 */
const biRequest = async (method, path, config, body, bearer) => {
  assert(bearer, 'biRequest: Need access token')
  const fullURL = `${config.url}${path}`

  const resp = await fetch(fullURL, {
    method: method,
    body: body,
    headers: {
      Authorization: `Bearer ${bearer}`
    }
  })

  if (resp.ok) {
    return await resp.json()
  } else {
    logger.warn(`Error while contacting BI (method: ${method}, path: ${path})`)
    const rawBody = await resp.text()
    logger.debug(rawBody)
    throw new BIError(rawBody)
  }
}

const encodeToForm = rawForm => {
  const formData = new FormData()
  for (const [k, v] of Object.entries(rawForm)) {
    formData.append(k, v)
  }
  return formData
}

export const getBIUserConfig = async (config, biAccessToken) => {
  return await biRequest('GET', '/users/me/config', config, null, biAccessToken)
}

export const updateBIUserConfig = async (config, userConfig, biAccessToken) => {
  return await biRequest(
    'POST',
    '/users/me/config',
    config,
    encodeToForm(userConfig),
    biAccessToken
  )
}

/**
 * Get a bi connection given it's id
 *
 * @param  {BIConfig} config
 * @param  {number} connId
 * @param  {string} biAccessToken
 * @return {BIConnection}
 */
export const getBIConnection = async (config, connId, biAccessToken) => {
  return await biRequest(
    'GET',
    `/users/me/connections/${connId}`,
    config,
    null,
    biAccessToken
  )
}

/**
 * Create a BI connection
 *
 * @param  {BIConfig} config
 * @param  {Object} encryptedAuth
 * @param  {string} biAccessToken
 * @return {BIConnection}
 */
export const createBIConnection = async (
  config,
  encryptedAuth,
  biAccessToken
) => {
  return await biRequest(
    'POST',
    '/users/me/connections',
    config,
    encodeToForm(encryptedAuth),
    biAccessToken
  )
}

/**
 * Update an existing BI connection
 *
 * @param  {BIConfig} config
 * @param  {number} connId
 * @param  {Object} encryptedAuth
 * @param  {string} biAccessToken
 * @return {BIConnection}
 */
export const updateBIConnection = async (
  config,
  connId,
  encryptedAuth,
  biAccessToken
) => {
  assert(
    connId,
    `Must pass connection id to updateBIConnection (${connId} was passed)`
  )
  const resp = await biRequest(
    'POST',
    `/users/me/connections/${connId}`,
    config,
    encodeToForm(encryptedAuth),
    biAccessToken
  )

  // The doc indicates that the response should be a connection object.
  // But, when the connection cannot be force updated, the response is
  // in the form { connection, message }.
  if (resp.id) {
    return resp
  } else if (resp.connection) {
    return resp.connection
  } else {
    throw new Error('Unknown response from Budget-Insight')
  }
}

/**
 * Resume a blocked BI connection
 *
 * @param  {BIConfig} config
 * @param  {number} connId
 * @param  {string} biAccessToken
 * @return {BIConnection}
 */
export const resumeBIConnection = async (config, connId, biAccessToken) => {
  assert(
    connId,
    `Must pass connection id to resumeBIConnection (${connId} was passed)`
  )
  return await biRequest(
    'PUT',
    `/users/me/connections/${connId}`,
    config,
    encodeToForm({ resume: 'true' }),
    biAccessToken
  )
}

export const setBIConnectionSyncStatus = async (
  config,
  connId,
  accountId,
  syncStatus,
  biAccessToken
) => {
  assert(
    connId,
    `Must pass connection id to resumeBIConnection (${connId} was passed)`
  )
  return await biRequest(
    'PUT',
    `/users/me/accounts/${accountId}?all`,
    config,
    encodeToForm({ disabled: syncStatus ? 'false' : 'true' }),
    biAccessToken
  )
}

export const getBIConnectionAccountsList = async (
  config,
  connId,
  biAccessToken
) => {
  assert(
    connId,
    `Must pass connection id to getBIConnectionAccountList (${connId} was passed)`
  )

  return await biRequest(
    'GET',
    `/users/me/connections/${connId}/accounts?all`,
    config,
    null,
    biAccessToken
  )
}
