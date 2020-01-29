/**
 * This is meant to be a subset of low level functions that are needed
 * to talk with Budget-Insight when adding a budget-insight connection.
 *
 * Much more of the API is supported in the banking konnector and it
 * might make sense to mutualize the code under a bi-sdk package if
 * we ever need more of it here.
 *
 * See https://github.com/cozy/cozy-libs/pull/929#discussion_r372238690
 */

import assert from '../assert'
import biPublicKeyProd from './bi-public-key-prod.json'

const biURLProd = 'https://cozy.biapi.pro/2.0'
const biURLDev = 'https://cozytest-sandbox.biapi.pro/2.0'

export const getBIModeFromCozyURL = rawCozyURL => {
  if (!rawCozyURL) {
    return 'dev'
  }
  const cozyURL = new URL(rawCozyURL)
  const domain = cozyURL.host
    .split('.')
    .slice(-2)
    .join('.')
  switch (domain) {
    case 'cozy.rocks':
    case 'mycozy.cloud':
      return 'prod'
    case 'cozy.works':
    case 'cozy.dev':
      return 'dev'
    default:
      return 'dev'
  }
}

export const getBIConfig = mode => {
  if (mode === 'prod') {
    return {
      url: biURLProd,
      publicKey: biPublicKeyProd
    }
  } else {
    return {
      url: biURLDev
    }
  }
}

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
        'User-Agent': 'cozy.bi-harvest',
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
  const connection = await biRequest(
    'POST',
    '/users/me/connections',
    config,
    encryptedAuth,
    biAccessToken
  )
  return connection
}

export const updateBIConnection = async (
  config,
  connId,
  encryptedAuth,
  biAccessToken
) => {
  return biRequest(
    'PUT',
    `/users/me/connections/${connId}`,
    config,
    encryptedAuth,
    biAccessToken
  )
}

export const isBudgetInsightConnector = konnector => {
  return (
    konnector.partnership &&
    konnector.partnership.domain.includes('budget-insight')
  )
}
