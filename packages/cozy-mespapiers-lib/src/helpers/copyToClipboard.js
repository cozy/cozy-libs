import copy from 'copy-text-to-clipboard'

import log from 'cozy-logger'

/**
 * Copy a string to the clipboard
 *
 * @param {string} value - The string saved to the clipboard
 * @param {object} [options]
 * @param {HTMLElement} options.target - Specify a DOM element where the temporary, behind-the-scenes textarea should be appended, in cases where you need to stay within a focus trap, like in a modal. Defaults to 'document.body'
 * @param {number} options.t - Translation function
 * @param {Function} options.showAlert - Function to display an alert
 */
export const copyToClipboard = (value, { target, t, showAlert } = {}) => {
  if (!value) return false
  try {
    // Prefer use "copy-text-to-clipboard" package instead of "navigator.clipboard.writeText" because it's not supported by Safari. cf https://github.com/cozy/cozy-libs/commit/c08d6c1583020b22ac6a35b25b317d59a8dbcbf3
    const hasCopied = copy(value, target ? { target } : undefined)
    if (hasCopied) {
      showAlert(t('action.copyReminderContent.success'), 'success')
    } else {
      showAlert(t('action.copyReminderContent.error'), 'error')
    }
  } catch (error) {
    showAlert(t('action.copyReminderContent.error'), 'error')
    log(
      'error',
      `Error in 'copyToClipboard' function when trying to copy to clipboard: ${error}`
    )
  }
}
