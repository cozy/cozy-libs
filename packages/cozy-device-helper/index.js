import capitalize from 'lodash/capitalize'

const WEB_PLATFORM = 'web'
const IOS_PLATFORM = 'ios'
const ANDROID_PLATFORM = 'android'
const DEFAULT_DEVICE = 'Device'

// cordova
const isCordova = () => window.cordova !== undefined

// platform
export const getPlatform = () => isCordova() ? window.cordova.platformId : WEB_PLATFORM
const isPlatform = platform => getPlatform() === platform
export const isIOSApp = () => isPlatform(IOS_PLATFORM)
export const isAndroidApp = () => isPlatform(ANDROID_PLATFORM)
export const isWebApp = () => isPlatform(WEB_PLATFORM)
export const isMobileApp = () => isCordova()

// plugin
export const hasDevicePlugin = () => {
  return isCordova() && window.device !== undefined
}
export const hasInAppBrowserPlugin = () => {
  return isCordova() && window.cordova.InAppBrowser !== undefined
}
export const hasSafariPlugin = () => {
  return new Promise(resolve => {
    if (!isCordova() || window.SafariViewController === undefined) {
      resolve(false)
      return
    }

    window.SafariViewController.isAvailable(available => resolve(available))
  })
}

// device
const getAppleModel = identifier => {
  const devices = ['iPhone', 'iPad', 'Watch', 'AppleTV']

  for (const device of devices) {
    if (identifier.match(new RegExp(device))) {
      return device
    }
  }

  return DEFAULT_DEVICE
}

export const getDeviceName = () => {
  if (!hasDevicePlugin()) {
    if (isCordova()) {
      console.warning('You should install `cordova-plugin-device`.')
    }
    return DEFAULT_DEVICE
  }

  const { manufacturer, model: originalModel } = window.device

  const model = isIOSApp() ? getAppleModel(originalModel) : originalModel

  return `${capitalize(manufacturer)} ${model}`
}
