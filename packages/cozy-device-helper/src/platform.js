import { isCordova } from './cordova'

const WEB_PLATFORM = 'web'
const IOS_PLATFORM = 'ios'
const ANDROID_PLATFORM = 'android'

/**
 * @return {string} - Current platform ("ios", "android", "web")
 */
export function getPlatform() {
  isCordova() ? window.cordova.platformId : WEB_PLATFORM
}

const isPlatform = platform => getPlatform() === platform

/**
 * @return {boolean} - Are we on iOS
 */
export function isIOSApp() {
  return isPlatform(IOS_PLATFORM)
}

/**
 * @return {boolean} - Are we on Android
 */
export function isAndroidApp() {
  return isPlatform(ANDROID_PLATFORM)
}

/**
 * @return {string} - Current platform ("ios", "android", "web")
 */
export function isWebApp() {
  return isPlatform(WEB_PLATFORM)
}

/**
 * @return {boolean} - Are we on mobile, checks for Cordova presence
 */
export function isMobileApp() {
  return isCordova()
}
