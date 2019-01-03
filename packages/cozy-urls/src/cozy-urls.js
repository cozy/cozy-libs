/* global URL */
import isNode from 'detect-node'

export const getBrowserCozyURL = () => {
  try {
    const root = document.querySelector('[role=application]')
    const data = root.dataset

    return new URL(`${window.location.protocol}//${data.cozyDomain}`)
  } catch (e) {
    throw new Error(
      `[cozy-url] cozyDomain isn't defined in index.ejs https://git.io/fhmP9, (${
        e.message
      })`
    )
  }
}

export const getNodeCozyURL = () => {
  try {
    return new URL(process.env.COZY_URL)
  } catch (e) {
    throw new Error(
      `[cozy-url] COZY_URL variable isn't defined, (${e.message}).`
    )
  }
}

export const getCozyURL = () =>
  isNode ? getNodeCozyURL() : getBrowserCozyURL()

export const getCozyDomain = url => {
  try {
    const parsedURL = url ? new URL(url) : getCozyURL()

    return parsedURL.host
  } catch (e) {
    throw new Error(
      `[cozy-urls] Can't find domain for '${url}', (${e.message}).`
    )
  }
}

export const getProtocol = url => {
  try {
    const parsedURL = url ? new URL(url) : getCozyURL()

    return parsedURL.protocol
  } catch (e) {
    throw new Error(
      `[cozy-urls] Can't find protocol for '${url}', (${e.message}).`
    )
  }
}

export const isSecureProtocol = url => {
  const protocol = getProtocol(url)

  return protocol === 'https:'
}
