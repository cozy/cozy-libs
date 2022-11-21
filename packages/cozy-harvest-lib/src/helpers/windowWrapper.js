/**
 * Mockable window.open
 *
 * @param {String} url
 * @param {String} target
 * @param {String} windowFeatures
 * @returns {Window} - Popup window instance
 */
export const windowOpen = (url, target, windowFeatures) => {
  return window.open(url, target, windowFeatures)
}
