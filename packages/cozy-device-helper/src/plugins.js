import { isCordova } from './cordova'

/**
 * Check for the Cordova device plugin
 * @return {boolean}
 */
export function hasDevicePlugin() {
  return isCordova() && window.device !== undefined
}

/**
 * Check for the Cordova plugin InAppBrowser
 * @return {boolean}
 */
export function hasInAppBrowserPlugin() {
  return isCordova() && window.cordova.InAppBrowser !== undefined
}

/**
 * Check for the Cordova SafariViewController plugin
 * @return {boolean}
 */
export function hasSafariPlugin() {
  return new Promise(resolve => {
    if (!isCordova() || window.SafariViewController === undefined) {
      resolve(false)
      return
    }

    window.SafariViewController.isAvailable(available => resolve(available))
  })
}
