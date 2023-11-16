import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

/**
 * Check if the OCR is activated
 * @param {Object} [webviewIntent] - The webview intent service to interact with the native environment.
 * @param {function} webviewIntent.call - A function to call flagshipApp methods, expecting the method name and its arguments.
 * @returns {Promise<boolean>} true if the OCR feature is available
 */
export const isFlagshipOCRAvailable = async webviewIntent => {
  const isFlagshipAppOcrAvailable = await webviewIntent?.call(
    'isAvailable',
    'ocr'
  )

  if (
    isFlagshipApp() &&
    isFlagshipAppOcrAvailable &&
    flag('mespapiers.ocr.enabled')
  ) {
    return true
  }
  return false
}
