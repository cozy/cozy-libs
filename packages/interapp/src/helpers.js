// helper to serialize/deserialize an error for/from postMessage
export const errorSerializer = (() => {
  function mapErrorProperties(from, to) {
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

const first = arr => arr && arr[0]
// In a far future, the user will have to pick the desired service from a list.
// For now it's our job, an easy job as we arbitrary pick the first service of
// the list.
export function pickService(intent, filterServices) {
  const services = intent.attributes.services
  const filteredServices = filterServices
    ? (services || []).filter(filterServices)
    : services
  return first(filteredServices)
}
