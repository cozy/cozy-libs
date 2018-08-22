import * as client from './client'
import * as service from './service'
import Request from './request'
import { pickService, buildRedirectionURL, removeQueryString } from './helpers'

class Interapp {
  constructor({ client, fetchJSON } = {}) {
    this.request = new Request(fetchJSON || client.client.fetchJSON)
  }

  create(action, type, data = {}, permissions = []) {
    if (!action)
      throw new Error(`Misformed intent, "action" property must be provided`)
    if (!type)
      throw new Error(`Misformed intent, "type" property must be provided`)

    const createPromise = this.request.post(action, type, data, permissions)

    createPromise.start = (element, onReadyCallback) => {
      const options = {
        filteredServices: data.filteredServices,
        onReadyCallback: onReadyCallback
      }

      delete data.filteredServices

      return createPromise.then(intent =>
        client.start(this.create)(intent, element, data, options)
      )
    }

    return createPromise
  }

  // returns a service to communicate with intent client
  createService(intentId, serviceWindow) {
    return service.start(this.request)(intentId, serviceWindow)
  }

  // Redirect to an app able to handle the doctype
  // Redirections are more or less a hack of the intent API to retrieve an URL for
  // accessing a given doctype or a given document.
  // It needs to use a special action `REDIRECT`
  async getRedirectionURL(type, data) {
    if (!type && !data) {
      throw new Error(
        `Cannot retrieve redirection, at least type or doc must be provided`
      )
    }

    const intent = await this.create('REDIRECT', type, data)

    const service = pickService(intent)
    if (!service) throw new Error('Unable to find a service')

    // Intents cannot be deleted now
    // await deleteIntent(intent)

    const baseURL = removeQueryString(service.href)
    return data ? buildRedirectionURL(baseURL, data) : baseURL
  }

  async redirect(type, doc, redirectFn) {
    if (!window)
      throw new Error('redirect() method can only be called in a browser')

    const redirectionURL = await this.getRedirectionURL(type, doc)
    if (redirectFn && typeof redirectFn === 'function') {
      return redirectFn(redirectionURL)
    }

    window.location.href = redirectionURL
  }
}

export default Interapp
