const WEB_PLATFORM = 'web'
const IOS_PLATFORM = 'ios'
const ANDROID_PLATFORM = 'android'
const DEFAULT_DEVICE = 'Device'

// cordova
const isCordova = () => window.cordova !== undefined

// platform
export const getPlatform = () => isCordova() ? window.cordova.platformId : WEB_PLATFORM
const isPlatform = platform => getPlatform() === platform
export const isIosApp = () => isPlatform(IOS_PLATFORM)
export const isAndroidApp = () => isPlatform(ANDROID_PLATFORM)
export const isWebApp = () => isPlatform(WEB_PLATFORM)
export const isMobileApp = () => isCordova()

// device
export const hasDeviceCordovaPlugin = () =>
  isCordova() && window.device !== undefined

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
  if (!hasDeviceCordovaPlugin()) {
    if (isCordova()) {
      console.warning('You should install `cordova-plugin-device`.')
    }
    return DEFAULT_DEVICE
  }

  const { manufacturer, model: originalModel } = window.device

  const model = isIosApp() ? getAppleModel(originalModel) : originalModel

  return `${capitalize(manufacturer)} ${model}`
}
