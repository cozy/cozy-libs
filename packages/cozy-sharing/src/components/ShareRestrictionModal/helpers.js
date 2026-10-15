import { endOfDay } from 'date-fns'

import { generateWebLink } from 'cozy-client'
import minilog from 'cozy-minilog'

import { getAppSlugFromDocumentType } from '../../helpers/link'
import { getShortcode } from '../../helpers/shortcodes'

const log = minilog('ShareRestrictionModal/helpers')

export const WRITE_PERMS = ['GET', 'POST', 'PUT', 'PATCH']
export const READ_ONLY_PERMS = ['GET']

/**
 * A share link expires at the END of the selected day, so picking today keeps
 * the link reachable for the rest of today and expires it the next day.
 * Without this, the picked day defaults to its midnight (start of day), which
 * is already in the past and makes the link unreachable as soon as it is set.
 * @param {Date|string|null|undefined} date - The picked expiration day
 * @returns {Date|null|undefined} - The same value normalized to end of day
 */
export const toExpirationDate = date => {
  if (!date) return date
  const parsed = date instanceof Date ? date : new Date(date)
  if (parsed.toString() === 'Invalid Date') return date
  return endOfDay(parsed)
}

/**
 * Create a sharing link for a file with specified options
 * @param {object} options
 * @param {object} options.client - CozyClient instance
 * @param {object} options.file - File to share
 * @param {string} options.documentType - Type of the document
 * @param {Function} options.shareByLink - Function to create permissions
 * @param {Function} options.t - Translation function
 * @param {Function} options.showAlert - Function to display an alert
 * @param {Date|string} [options.ttl] - Time to live of the sharing link
 * @param {'readOnly'|'write'} [options.editingRights] - Editing rights
 * @param {string} [options.password] - Password
 * @param {boolean} [options.withTTL] - Whether to add a default TTL
 * @returns {Promise<string|null>} - The generated web link or null if permissions creation fails
 */
export const createSharingLink = async ({
  client,
  file,
  documentType,
  shareByLink,
  getOwner,
  getSharingById,
  t,
  ttl,
  editingRights = 'readOnly',
  password,
  showAlert
}) => {
  const permsResult = await createPermissions({
    file,
    t,
    ttl,
    editingRights,
    password,
    documentType,
    shareByLink,
    showAlert
  })
  const code = getShortcode(permsResult?.data)
  if (!code) {
    return null
  }
  return generateShareLinkFromFile({
    client,
    file,
    sharecode: code,
    getOwner,
    getSharingById,
    documentType
  })
}

/**
 * Generate a sharing link from a file and sharecode
 * @param {object} options
 * @param {object} options.client - CozyClient instance
 * @param {object} options.file - File to share
 * @param {string} options.sharecode - Share code
 * @param {Function} options.getOwner - Function to get the owner of a sharing
 * @param {Function} options.getSharingById - Function to get a sharing by ID
 * @param {string} options.documentType - Type of the document
 * @returns {string} - The generated web link
 */
export const generateShareLinkFromFile = ({
  client,
  file,
  sharecode,
  getOwner,
  getSharingById,
  documentType
}) => {
  let cozyUrl = client.getStackClient().uri
  if (file.driveId) {
    const sharing = getSharingById(file.driveId)
    const owner = getOwner(sharing?.rules?.[0]?.values?.[0])
    cozyUrl = owner?.instance || client.getStackClient().uri
  }
  return generateWebLink({
    cozyUrl,
    searchParams: [['sharecode', sharecode]],
    pathname: '/public',
    slug: getAppSlugFromDocumentType({ documentType }),
    subDomainType: client.capabilities.flat_subdomains ? 'flat' : 'nested'
  })
}

/**
 * Copy a value to the clipboard.
 *
 * Accepts a resolved string or a `Promise<string>`. The promise form is
 * required when the value depends on a prior async step (e.g. creating a
 * sharing link) from within a click handler: Safari drops the user-gesture
 * context across any `await`, so `navigator.clipboard.writeText` called after
 * an awaited call throws `NotAllowedError`. Passing a pending blob to
 * `ClipboardItem` lets the clipboard API be invoked synchronously while the
 * content is resolved later.
 *
 * @param {string | Promise<string>} value - Value to copy
 * @param {object} [options]
 * @param {Function} options.t - Translation function
 * @param {Function} options.showAlert - Function to display an alert
 */
export const copyToClipboard = async (value, { t, showAlert } = {}) => {
  if (!value) return false
  try {
    if (typeof value === 'string') {
      await navigator.clipboard.writeText(value)
    } else if (typeof ClipboardItem !== 'undefined') {
      const blobPromise = Promise.resolve(value).then(
        text => new Blob([text], { type: 'text/plain' })
      )
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': blobPromise })
      ])
    } else {
      await navigator.clipboard.writeText(await value)
    }
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
      const expiration = toExpirationDate(selectedDateConverted)
      const ttl =
        expiration > now
          ? `${Math.round((expiration - now) / 1000)}s`
          : undefined
      return ttl
    }
    throw new Error(`Invalid date: ${selectedDate}`)
  } catch (error) {
    log.error(error)
    return
  }
}

export const getLinkAccessOptions = ({
  editingRights,
  dateEnabled,
  selectedDate,
  passwordEnabled,
  password
}) => {
  const expirationDate =
    dateEnabled && selectedDate ? toExpirationDate(selectedDate) : null

  return {
    verbs: editingRights === 'write' ? WRITE_PERMS : READ_ONLY_PERMS,
    expiresAt: expirationDate?.toISOString() || '',
    ttl: expirationDate ? makeTTL(expirationDate) : undefined,
    // An empty field means "unchanged": undefined is left out of the request
    password: passwordEnabled ? password || undefined : ''
  }
}

/**
 * createPermissions - Create the permissions of a file
 * @param {object} options
 * @param {import('cozy-client/types/types').IOCozyFile} options.file File to update permissions
 * @param {Function} options.t i18n function
 * @param {Date|string} options.ttl - Time to live of the sharing link
 * @param {string} options.password - Password
 * @param {'readOnly'|'write'} options.editingRights - Editing rights
 * @param {string} options.documentType - Type of the document
 * @param {Function} options.shareByLink - Function to create permissions
 * @param {Function} options.showAlert - Function to display an alert
 */
export const createPermissions = async ({
  file,
  t,
  ttl,
  password,
  editingRights,
  documentType,
  shareByLink,
  showAlert
}) => {
  try {
    const verbs = editingRights === 'readOnly' ? READ_ONLY_PERMS : WRITE_PERMS
    return shareByLink(file, { verbs, ttl, password })
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
}

/**
 * updatePermissions - Updates the permissions of a file
 * @param {object} options
 * @param {import('cozy-client/types/types').IOCozyFile} options.file File to update permissions
 * @param {Function} options.t i18n function
 * @param {boolean} options.dateToggle - Expiration date toggle
 * @param {Date|null} options.selectedDate - Expiration date
 * @param {boolean} options.passwordToggle - Password toggle
 * @param {string} options.password - Password
 * @param {string} options.documentType - Type of the document
 * @param {'readOnly'|'write'} options.editingRights - Editing rights
 * @param {Function} options.updateDocumentPermissions - Function to update permissions
 * @param {Function} options.showAlert - Function to display an alert
 */
export const updatePermissions = async ({
  file,
  t,
  dateToggle,
  selectedDate,
  passwordToggle,
  password,
  editingRights,
  documentType,
  updateDocumentPermissions,
  showAlert
}) => {
  try {
    const {
      verbs,
      expiresAt,
      password: ensuredPassword
    } = getLinkAccessOptions({
      editingRights,
      dateEnabled: dateToggle,
      selectedDate,
      passwordEnabled: passwordToggle,
      password
    })
    return updateDocumentPermissions(file, {
      verbs,
      expiresAt,
      password: ensuredPassword
    })
  } catch (err) {
    showAlert({
      message: t(`${documentType}.share.shareByLink.permserror`),
      severity: 'error',
      variant: 'filled'
    })
    log.error(
      "Error in 'updateDocumentPermissions' function when trying to change permission",
      err
    )
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
      "Error in 'revokePermissions' function when trying to revoke sharing link",
      err
    )
  }
}
