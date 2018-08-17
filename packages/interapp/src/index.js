import { cozyFetchJSON } from '../fetch'
import { pickService } from './helpers'
import * as client from './client'
import * as service from './service'

export function create(cozy, action, type, data = {}, permissions = []) {
  if (!action)
    throw new Error(`Misformed intent, "action" property must be provided`)
  if (!type)
    throw new Error(`Misformed intent, "type" property must be provided`)

  const createPromise = cozyFetchJSON(cozy, 'POST', '/intents', {
    data: {
      type: 'io.cozy.intents',
      attributes: {
        action: action,
        type: type,
        data: data,
        permissions: permissions
      }
    }
  })

  createPromise.start = (element, onReadyCallback) => {
    const options = {
      filteredServices: data.filteredServices,
      onReadyCallback: onReadyCallback
    }

    delete data.filteredServices

    return createPromise.then(intent =>
      client.start(cozy, intent, element, data, options)
    )
  }

  return createPromise
}

// returns a service to communicate with intent client
export function createService(cozy, intentId, serviceWindow) {
  return service.start(cozy, intentId, serviceWindow)
}

function removeQueryString(url) {
  return url.replace(/\?[^/#]*/, '')
}

// Redirect to an app able to handle the doctype
// Redirections are more or less a hack of the intent API to retrieve an URL for
// accessing a given doctype or a given document.
// It needs to use a special action `REDIRECT`
export async function getRedirectionURL(cozy, type, data) {
  if (!type && !data)
    throw new Error(
      `Cannot retrieve redirection, at least type or doc must be provided`
    )

  const intent = await create(cozy, 'REDIRECT', type, data)

  const service = pickService(intent)
  if (!service) throw new Error('Unable to find a service')

  // Intents cannot be deleted now
  // await deleteIntent(cozy, intent)

  const baseURL = removeQueryString(service.href)
  return data ? buildRedirectionURL(baseURL, data) : baseURL
}

function isSerializable(value) {
  return !['object', 'function'].includes(typeof value)
}

function buildRedirectionURL(url, data) {
  const parameterStrings = Object.keys(data)
    .filter(key => isSerializable(data[key]))
    .map(key => `${key}=${data[key]}`)

  return parameterStrings.length ? `${url}?${parameterStrings.join('&')}` : url
}

export async function redirect(cozy, type, doc, redirectFn) {
  if (!window)
    throw new Error('redirect() method can only be called in a browser')
  const redirectionURL = await getRedirectionURL(cozy, type, doc)
  if (redirectFn && typeof redirectFn === 'function') {
    return redirectFn(redirectionURL)
  }

  window.location.href = redirectionURL
}
