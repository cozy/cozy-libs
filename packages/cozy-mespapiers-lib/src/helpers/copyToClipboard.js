import minilog from 'cozy-minilog'

const log = minilog('copyToClipboard')

/**
 * Copy a string to the clipboard
 *
 * @param {string} value - The string saved to the clipboard
 * @param {object} [options]
 * @param {number} options.t - Translation function
 * @param {Function} options.showAlert - Function to display an alert
 */
export const copyToClipboard = async (value, { t, showAlert } = {}) => {
  if (!value) return false
  try {
    await navigator.clipboard.writeText(value)
    showAlert(t('action.copyReminderContent.success'), 'success')
  } catch (error) {
    showAlert(t('action.copyReminderContent.error'), 'error')
    log.error(
      "Error in 'copyToClipboard' function when trying to copy to clipboard",
      error
    )
  }
}
