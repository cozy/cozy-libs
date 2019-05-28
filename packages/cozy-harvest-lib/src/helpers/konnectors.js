import get from 'lodash/get'
import has from 'lodash/has'

// Type of errors returned by konnector
const CHALLENGE_ASKED = 'CHALLENGE_ASKED'
const DISK_QUOTA_EXCEEDED = 'DISK_QUOTA_EXCEEDED'
const LOGIN_FAILED = 'LOGIN_FAILED'
const MAINTENANCE = 'MAINTENANCE'
const NOT_EXISTING_DIRECTORY = 'NOT_EXISTING_DIRECTORY'
const TERMS_VERSION_MISMATCH = 'TERMS_VERSION_MISMATCH'
const UNKNOWN_ERROR = 'UNKNOWN_ERROR'
const USER_ACTION_NEEDED = 'USER_ACTION_NEEDED'
const VENDOR_DOWN = 'VENDOR_DOWN'

const KNOWN_ERRORS = [
  CHALLENGE_ASKED,
  DISK_QUOTA_EXCEEDED,
  LOGIN_FAILED,
  MAINTENANCE,
  NOT_EXISTING_DIRECTORY,
  TERMS_VERSION_MISMATCH,
  USER_ACTION_NEEDED,
  VENDOR_DOWN
]

const USER_ERRORS = [
  CHALLENGE_ASKED,
  DISK_QUOTA_EXCEEDED,
  LOGIN_FAILED,
  NOT_EXISTING_DIRECTORY,
  USER_ACTION_NEEDED
]

/**
 * Custom error to handle errors returnes by konnector.
 * Konnectors are returning error codes in error messages.
 * Those codes are known and we need to associate logic to them.
 * For now, this logic only concerns login error.
 * @extends Error
 */
export class KonnectorJobError extends Error {
  constructor(...args) {
    super(...args)
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, KonnectorJobError)
    }

    /**
     * Konnector job are throwing error with a message containing the error
     * code.
     * Example: LOGIN_FAILED, USER_ACTION_NEEDED,
     *          USER_ACTION_NEEDED.PERMISSIONS_CHANGED
     */
    this.code = this.message

    /**
     * Some error codes are composed with several segments, and can be parsed.
     * Example : USER_ACTION_NEEDED.PERMISSIONS_CHANGED
     * The error type correspond to the first segment of the error.
     */
    const type = this.code.split('.')[0]
    this.type = KNOWN_ERRORS.includes(type) ? type : UNKNOWN_ERROR
  }

  /**
   * Test if the konnector error is a login error
   * @return {Boolean}
   */
  isLoginError() {
    return this.type === LOGIN_FAILED
  }

  /**
   * Test if the konnector error is a user error
   * @return {Boolean} [description]
   */
  isUserError() {
    return USER_ERRORS.includes(this.type)
  }
}

/**
 * Returns the account type. Based on the information from the oauth attribute,
 * or the slug.
 * @param  {Object} konnector
 * @return {string}           Account type
 */
export const getAccountType = konnector => {
  return get(konnector, 'oauth.account_type', konnector.slug)
}

/**
 * Indicates if the given konnector requires a folder to work properly.
 * This directly relies on the `fields.advancedFields.folderPath` from manifest.
 * @param  {Object} konnector
 * @return {bool}   `true` if the konnector needs a folder
 */
export const needsFolder = konnector =>
  has(konnector, 'fields.advancedFields.folderPath')

/**
 * Returns a permission ready to be passed to
 * client.collection('io.cozy.permissions').add().
 * @param  {Object} konnector The konnector to add permission to
 * @param  {Object} folder    The folder which the konnector should have access
 * @return {Object}           Permission object
 */
export const buildFolderPermission = folder => {
  return {
    // Legacy name
    saveFolder: {
      type: 'io.cozy.files',
      values: [folder._id],
      verbs: ['GET', 'PATCH', 'POST']
    }
  }
}

export default {
  KonnectorJobError,
  getAccountType,
  needsFolder,
  buildFolderPermission
}
