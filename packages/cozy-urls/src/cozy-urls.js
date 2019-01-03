import isNode from 'detect-node'

const ERROR_DOMAIN_BROWSER = `[cozy-url] cozyDomain isn't defined in index.ejs https://git.io/fhmP9`
const ERROR_DOMAIN_NODE = `[cozy-url] COZY_URL variable isn't defined.`
const ERROR_PROTOCOL_URL_INVALID = `[cozy-urls] Can't find protocol for`

const DOMAIN_REGEX = '(((https?):)?/{2})?(([^.]*.)*[^./:]*)'

let cozyURL

export const getBrowserCozyURL = () => {
  if (cozyURL) return cozyURL

  try {
    const root = document.querySelector('[role=application]')
    const data = root.dataset
    cozyURL = `${window.location.protocol}//${data.cozyDomain}`

    return cozyURL
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(ERROR_DOMAIN_BROWSER)
    throw e
  }
}

export const getNodeCozyURL = () => {
  if (cozyURL) return cozyURL

  try {
    cozyURL = process.env.COZY_URL

    return cozyURL
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(ERROR_DOMAIN_NODE)
    throw e
  }
}

export const getCozyURL = () =>
  isNode ? getNodeCozyURL() : getBrowserCozyURL()

export const getCozyDomain = url => {
  if (url === undefined) {
    url = getCozyURL()
  }

  return url.match(DOMAIN_REGEX)[4]
}

export const getProtocol = url => {
  if (url === undefined) {
    url = getCozyURL()
  }

  try {
    const parsedURL = new URL(url)

    return parsedURL.protocol
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(ERROR_PROTOCOL_URL_INVALID, `'${url}'.`)
    throw e
  }
}

export const useSSL = url => {
  const protocol = getProtocol(url)

  return protocol === 'https:'
}
