// @ts-check
import { popupCenter } from './Popup'
import { isMobileApp } from 'cozy-device-helper'
import { windowOpen } from '../helpers/windowWrapper'

/**
 * @typedef OpenWindowResult
 * @property {"CLOSED"|"DISMISSED"} result
 */

/**
 * Opens a web popup
 *
 * @param {Object} options
 * @param {String} options.url - Url to open the popup on
 * @param {String} options.title - Title of the popup
 * @param {Number} options.width - Width of the popup
 * @param {Number} options.height - Height of the popup
 * @param {Function} options.handleUrlChange - Function to call when popup url changes
 * @param {Function} options.registerRealtime - Function to call to register realtime events
 * @returns {Promise<OpenWindowResult>}
 */
export function openWindow({
  url,
  title,
  width,
  height,
  handleUrlChange,
  registerRealtime
}) {
  const { w, h, top, left } = popupCenter(width, height)
  const popup = windowOpen(
    url,
    title || '',
    `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
  )

  return new Promise((resolve, reject) => {
    if (!popup) {
      reject(
        'Popup was blocked by browser. Be sure to not call showPopup asynchronously'
      )
    }

    // Puts focus on the new window
    if (popup.focus) {
      popup.focus()
    }

    let checkClosedInterval
    let unregisterRealtime
    const cleanAndResolve = data => {
      if (handleUrlChange) {
        removeListeners(popup, handleUrlChange)
      }
      stopMonitoringClosing(checkClosedInterval)
      if (registerRealtime) {
        unregisterRealtime()
      }
      if (!popup.closed) popup.close()
      resolve(data)
    }
    if (handleUrlChange) {
      addListeners(popup, cleanAndResolve, handleUrlChange)
    }
    if (registerRealtime) {
      unregisterRealtime = registerRealtime(cleanAndResolve)
    }
    checkClosedInterval = startMonitoringClosing(popup, cleanAndResolve)
  })
}

/**
 * Monitors if the current popup is closed
 *
 * @param {Window} popup
 * @param {Function} resolve - callback to run when popup is closed
 * @param {Number} checkClosedInterval - setInterval identifier
 * @returns {void}
 */
function monitorClosing(popup, resolve, checkClosedInterval) {
  if (popup.closed) {
    stopMonitoringClosing(checkClosedInterval)
    resolve({ result: 'CLOSED' })
  }
}

/**
 * Check if window is closing every 500ms
 *
 * @param  {Window} popup
 */
function startMonitoringClosing(popup, resolve) {
  const checkClosedInterval = setInterval(
    () => monitorClosing(popup, resolve, checkClosedInterval),
    500
  )
  return checkClosedInterval
}

/**
 * Stop monitoriing if the current popup is closed
 *
 * @param {Number} checkClosedInterval - setInterval identifier
 */
function stopMonitoringClosing(checkClosedInterval) {
  clearInterval(checkClosedInterval)
}

/**
 * Removes all listeners
 *
 * @param {Object} popup - Current popup
 * @param {Function} handleUrlChange - handleUrlChange function not to listen anymore
 * @returns <void>
 */
function removeListeners(popup, handleUrlChange) {
  // rest of instructions only if popup is still opened
  if (popup.closed) return

  // rest of instructions only on mobile app
  if (!isMobileApp()) return
  popup.removeEventListener('loadstart', handleUrlChange)
  popup.removeEventListener('exit', handleClose)
}

/**
 * Add listeners
 *
 * @param {Object} popup
 * @param {Function} resolve
 * @param {Function} handleUrlChange
 * @returns <void>
 */
function addListeners(popup, resolve, handleUrlChange) {
  // rest of instructions only on mobile app
  if (!isMobileApp()) return
  popup.addEventListener('loadstart', handleUrlChange(resolve))
  popup.addEventListener('exit', handleClose(resolve))
}

/**
 * Function called when the popup is closed
 *
 * @param {Function} resolve
 * @returns {Function}
 */
function handleClose(resolve) {
  return popup => {
    resolve(popup)
  }
}
