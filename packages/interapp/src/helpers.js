// helper to serialize/deserialize an error for/from postMessage
export const errorSerializer = (() => {
  const mapErrorProperties = (from, to) => {
    const result = Object.assign(to, from)
    const nativeProperties = ['name', 'message']
    return nativeProperties.reduce((result, property) => {
      if (from[property]) {
        to[property] = from[property]
      }
      return result
    }, result)
  }
  return {
    serialize: error => mapErrorProperties(error, {}),
    deserialize: data => mapErrorProperties(data, new Error(data.message))
  }
})()

// In a far future, the user will have to pick the desired service from a list.
// For now it's our job, an easy job as we arbitrary pick the first service of
// the list.
export const pickService = (intent, filterServices) => {
  const first = arr => arr && arr[0]

  const services = intent.attributes.services
  const filteredServices = filterServices
    ? (services || []).filter(filterServices)
    : services
  return first(filteredServices)
}

export const buildRedirectionURL = (url, data) => {
  const isSerializable = value => !['object', 'function'].includes(typeof value)

  const parameterStrings = Object.keys(data)
    .filter(key => isSerializable(data[key]))
    .map(key => `${key}=${data[key]}`)

  return parameterStrings.length ? `${url}?${parameterStrings.join('&')}` : url
}

export const removeQueryString = url => url.replace(/\?[^/#]*/, '')
