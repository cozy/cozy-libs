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

/**
 * Sends BI request and parses the response
 * Handles authentication and form serializing
 *
 * @throws {KonnectorJobError} Converts BI errors to KonnectorJobError
 */
const biRequest = async (method, path, config, rawForm, bearer) => {
  assert(bearer, 'biRequest: Need access token')
  const fullURL = `${config.url}${path}`
  const formData = new FormData()
  for (const [k, v] of Object.entries(rawForm)) {
    formData.append(k, v)
  }

  try {
    const resp = await fetch(fullURL, {
      method: method,
      body: formData,
      headers: {
        Authorization: `Bearer ${bearer}`
      }
    })
    return await resp.json()
  } catch (originalError) {
    // eslint-disable-next-line no-console
    console.error(originalError)
    const err = new Error('biRequest failed')
    err.original = originalError
    throw err
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
