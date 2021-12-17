/* global window */

const saveDeeplink = url => {
  window.deeplinkURL = url
}

const clearDeeplink = () => {
  window.deeplinkURL = null
}

const getDeeplink = () => {
  return window.deeplinkURL
}

const generateRoute = (url, appInfos) => {
  const { protocol, universalLinkDomain, appSlug } = appInfos
  const urlObj = new URL(url)

  // Remove fallback fallback params not needed anymore at this stage
  if (urlObj.searchParams.has('fallback')) {
    urlObj.searchParams.delete('fallback')
  }
  let path = ''
  let newUrl = urlObj.toString()
  if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
    path = newUrl.replace(universalLinkDomain + '/' + appSlug, '')
  } else {
    path = newUrl.replace(protocol, '')
  }

  if (path.startsWith('/')) path = path.substring(1)

  return path
}

export default {
  clear: clearDeeplink,
  save: saveDeeplink,
  get: getDeeplink,
  generateRoute: generateRoute
}
