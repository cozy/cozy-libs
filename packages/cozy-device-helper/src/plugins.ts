import { isCordova } from './cordova'

export const hasDevicePlugin = (): boolean => {
  return isCordova() && window.device !== undefined
}
export const hasInAppBrowserPlugin = (): boolean => {
  return isCordova() && window.cordova.InAppBrowser !== undefined
}
export const hasSafariPlugin = (): Promise<boolean> => {
  return new Promise(resolve => {
    if (!isCordova() || window.SafariViewController === undefined) {
      resolve(false)
      return
    }

    window.SafariViewController.isAvailable(available => resolve(available))
  })
}

/**
 * Cordova apps are deprecated, we should not use this plugin anymore
 * Still, we need to expose this function to avoid breaking changes for now
 * @returns {boolean}
 */
export const hasNetworkInformationPlugin = (): boolean => {
  return false
}
