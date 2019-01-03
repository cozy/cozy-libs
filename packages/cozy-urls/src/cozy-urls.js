/* global URL */
import isNode from 'detect-node'

const ERROR_DOMAIN_BROWSER = `[cozy-url] cozyDomain isn't defined in index.ejs https://git.io/fhmP9`
const ERROR_DOMAIN_NODE = `[cozy-url] COZY_URL variable isn't defined.`
const ERROR_PROTOCOL_URL_INVALID = `[cozy-urls] Can't find protocol for`
const ERROR_DOMAIN_URL_INVALID = `[cozy-urls] Can't find domain for`

let cozyURL

export const getBrowserCozyURL = () => {
  if (cozyURL) return cozyURL

  try {
    const root = document.querySelector('[role=application]')
    const data = root.dataset

    return new URL(`${window.location.protocol}//${data.cozyDomain}`)
  } catch (e) {
    throw new Error(ERROR_DOMAIN_BROWSER)
  }
}

export const getNodeCozyURL = () => {
  try {
    return new URL(process.env.COZY_URL)
  } catch (e) {
    throw new Error(ERROR_DOMAIN_NODE)
  }
}

export const getCozyURL = () =>
  isNode ? getNodeCozyURL() : getBrowserCozyURL()

export const getCozyDomain = url => {
  try {
    const parsedURL = url ? new URL(url) : getCozyURL()

    return parsedURL.host
  } catch (e) {
    throw new Error(ERROR_DOMAIN_URL_INVALID, `'${url}'.`)
  }
}

export const getProtocol = url => {
  try {
    const parsedURL = url ? new URL(url) : getCozyURL()

    return parsedURL.protocol
  } catch (e) {
    throw new Error(ERROR_PROTOCOL_URL_INVALID, `'${url}'.`)
  }
}

export const isSecureProtocol = url => {
  const protocol = getProtocol(url)

  return protocol === 'https:'
}
