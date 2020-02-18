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

export const updateBIConnection = async (
  config,
  connId,
  data,
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
    encodeToForm(data),
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
