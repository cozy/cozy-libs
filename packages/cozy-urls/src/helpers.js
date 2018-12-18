/* global __DEVELOPMENT__ */

const VALID_PROTOCOLS = ['http:', 'https:']

let APP_NAME = null

const isDevelopment = () =>
  typeof __DEVELOPMENT__ !== 'undefined' && !!__DEVELOPMENT__

// Optional
// Allow to specificy which application or library is throwing the error message
export const setAppName = name => {
  APP_NAME = name
}
export const getAppName = () => APP_NAME || 'The app'

export const getSSL = (cozyURL, ssl) => {
  if (typeof ssl !== 'undefined' && ssl !== null) return ssl

  let parsedURL
  try {
    parsedURL = new URL(cozyURL)
    if (!VALID_PROTOCOLS.includes(parsedURL.protocol)) {
      throw new Error(`Not valid protocol: ${parsedURL.protocol}`)
    }
    return parsedURL.protocol === 'https:'
  } catch (error) {
    if (isDevelopment()) {
      // eslint-disable-next-line no-console
      console.warn(
        `[URLS] cozyURL parameter provided is not a valid URL (${
          error.message
        }). ${getAppName()} will rely on window.location to detect SSL.`
      )
    }
  }

  if (window && window.location && window.location.protocol) {
    return window.location.protocol === 'https:'
  }

  // eslint-disable-next-line no-console
  console.warn(
    `[URLS] ${getAppName()} cannot detect SSL and will use default value (true)`
  )

  return true
}

export const getUrlAndHost = (cozyURL, ssl) => {
  let url
  let host
  const defaultProtocol = ssl ? 'https' : 'http'

  try {
    // only on mobile we get the full URL with the protocol
    const parsedURL = new URL(cozyURL)
    if (!VALID_PROTOCOLS.includes(parsedURL.protocol)) {
      throw new Error(`Not valid protocol: ${parsedURL.protocol}`)
    }
    host = parsedURL.host
    url = `${parsedURL.protocol}//${host}`
    return { host, url }
  } catch (error) {
    if (isDevelopment()) {
      // eslint-disable-next-line no-console
      console.warn(
        `[URLS] cozyURL parameter provided is not a valid URL (${
          error.message
        }). ${getAppName()} will use ${cozyURL} with '${defaultProtocol}' protocol`
      )
    }
  }

  // default results
  host = cozyURL.replace(/^\/\//, '') // sometimes it can begin by '//'
  url = `${defaultProtocol}://${host}`

  return { url, host }
}
