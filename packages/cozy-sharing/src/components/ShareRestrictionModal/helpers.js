import minilog from 'cozy-minilog'

const log = minilog('ShareRestrictionModal/helpers')

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
    showAlert({
      message: t('copyReminderContent.success'),
      severity: 'success',
      variant: 'filled'
    })
  } catch (error) {
    showAlert({
      message: t('copyReminderContent.error'),
      severity: 'error',
      variant: 'filled'
    })
    log.error(
      "Error in 'copyToClipboard' function when trying to copy to clipboard",
      error
    )
  }
}
