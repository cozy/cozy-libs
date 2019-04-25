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

export default {
  clear: clearDeeplink,
  save: saveDeeplink,
  get: getDeeplink
}
