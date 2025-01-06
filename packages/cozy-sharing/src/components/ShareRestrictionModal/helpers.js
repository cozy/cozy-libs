import { getSharingLink } from 'cozy-client/dist/models/sharing'
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

/**
 * Make a TTL string from a date
 * @param {Date|string} selectedDate
 * @returns {string} - TTL string in seconds (e.g. '1234s')
 */
export const makeTTL = selectedDate => {
  if (!selectedDate) return
  try {
    let selectedDateConverted = selectedDate
    if (typeof selectedDate === 'string') {
      selectedDateConverted = new Date(selectedDate)
      if (selectedDateConverted?.toString() === 'Invalid Date') {
        throw new Error(`Invalid date: ${selectedDate}`)
      }
    }
    if (selectedDateConverted instanceof Date) {
      const now = new Date()
      const ttl =
        selectedDateConverted > now
          ? `${Math.round((selectedDateConverted - now) / 1000)}s`
          : undefined
      return ttl
    }
    throw new Error(`Invalid date: ${selectedDate}`)
  } catch (error) {
    log.error(error)
    return
  }
}

/**
 * forwardFile - Triggers the download of one or multiple files by the browser
 * @param {object} options
 * @param {import('cozy-client/types/CozyClient').default} options.client
 * @param {import('cozy-client/types/types').IOCozyFile} options.file File to download
 * @param {Function} options.t i18n function
 * @param {string} options.ttl Time to live of the sharing link
 * @param {string} options.password Password of the sharing link
 * @param {Function} options.showAlert - Function to display an alert
 */
export const forwardFile = async ({
  client,
  file,
  t,
  ttl,
  password,
  showAlert
}) => {
  try {
    // We currently support only one file at a time
    const url = await getSharingLink(client, [file._id], { ttl, password })
    const isZipFile = file.class === 'zip'
    const shareData = {
      title: t('shareFile.title', {
        name: file.name,
        smart_count: isZipFile ? 2 : 1
      }),
      text: t('shareFile.text', {
        name: file.name,
        smart_count: isZipFile ? 2 : 1
      }),
      url
    }
    navigator.share(shareData)
  } catch (error) {
    showAlert({
      message: t('shareFile.error'),
      severity: 'error',
      variant: 'filled'
    })
  }
}

/**
 * updatePermissions - Updates the permissions of a file
 * @param {object} options
 * @param {import('cozy-client/types/types').IOCozyFile} options.file File to update permissions
 * @param {Function} options.t i18n function
 * @param {string} options.documentType - Type of the document
 * @param {'readOnly'|'write'} options.editingRights - Editing rights
 * @param {Function} options.updateDocumentPermissions - Function to update permissions
 * @param {Function} options.showAlert - Function to display an alert
 */
export const updatePermissions = async ({
  file,
  t,
  editingRights,
  documentType,
  updateDocumentPermissions,
  showAlert
}) => {
  switch (editingRights) {
    case 'readOnly':
      try {
        return updateDocumentPermissions(file, ['GET'])
      } catch (err) {
        showAlert({
          message: t(`${documentType}.share.shareByLink.permserror`),
          severity: 'error',
          variant: 'filled'
        })
        log.error(
          "Error in 'readOnlyPermissionLink' function when trying to change permission",
          err
        )
      }
      break
    case 'write':
      try {
        return updateDocumentPermissions(file, ['GET', 'POST', 'PUT', 'PATCH'])
      } catch (err) {
        showAlert({
          message: t(`${documentType}.share.shareByLink.permserror`),
          severity: 'error',
          variant: 'filled'
        })
        log.error(
          "Error in 'editPermissionLink' function when trying to change permission",
          err
        )
      }
      break
  }
}

/**
 * revokePermissions - Revokes the permissions of a file
 * @param {object} options
 * @param {import('cozy-client/types/types').IOCozyFile} options.file File to revoke permissions
 * @param {Function} options.t i18n function
 * @param {string} options.documentType - Type of the document
 * @param {Function} options.revokeSharingLink - Function to revoke permissions
 * @param {Function} options.showAlert - Function to display an alert
 */
export const revokePermissions = async ({
  file,
  t,
  documentType,
  revokeSharingLink,
  showAlert
}) => {
  try {
    return revokeSharingLink(file)
  } catch (err) {
    showAlert({
      message: t(`${documentType}.share.error.revoke`),
      severity: 'error',
      variant: 'filled'
    })
    log.error(
      "Error in 'revokeLink' function when trying to revoke sharing link",
      err
    )
  }
}
