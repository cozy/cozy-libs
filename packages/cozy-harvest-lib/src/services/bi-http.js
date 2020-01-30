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
const biRequest = async (method, path, config, rawForm, bearer) => {
  assert(bearer, 'biRequest: Need access token')
  const fullURL = `${config.url}${path}`
  const formData = new FormData()
  for (const [k, v] of Object.entries(rawForm)) {
    formData.append(k, v)
  }

  const resp = await fetch(fullURL, {
    method: method,
    body: formData,
    headers: {
      Authorization: `Bearer ${bearer}`
    }
  })

  if (resp.ok) {
    return await resp.json()
  } else {
    const rawBody = await resp.text()
    throw new BIError(rawBody)
  }
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
    encryptedAuth,
    biAccessToken
  )
}

export const updateBIConnection = async (
  config,
  connId,
  encryptedAuth,
  biAccessToken
) => {
  return await biRequest(
    'PUT',
    `/users/me/connections/${connId}`,
    config,
    encryptedAuth,
    biAccessToken
  )
}
