import get from 'lodash/get'
import has from 'lodash/has'
import trim from 'lodash/trim'

import * as accounts from './accounts'

// Default name for base directory
const DEFAULT_LOCALIZED_BASE_DIR = 'Administrative'

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
 * Returns the locale of an error key (description or title or else).
 * This method first try to get the full error code
 * (for example LOGIN_FAILED.LOGIN_FAILED.NEEDS_SECRET), then fallback on the
 * error type, which is the error code first segment (in our example, it's
 * LOGIN_FAILED). It none of these two tries returns anything, it means
 * that the error is unknown or not yet handled by harvest, so we fallback
 * to the default error messages.
 * @param  {Error} error      The error
 * @param  {Object} konnector konnector related to this error
 * @param  {Func} t           Translation function, expected to be Polyglot.t()
 * @param  {Func} suffixKey   What part of the error message should be returned, title or description
 * @return {String}           The error locale
 */
export const getErrorLocale = (error, konnector, t, suffixKey) => {
  const defaultKey = 'error.job.UNKNOWN_ERROR'
  const translationVariables = {
    name: konnector.name || '',
    link: konnector.vendor_link || ''
  }

  // not handled errors
  if (!(error instanceof KonnectorJobError)) {
    const locale = t(`${defaultKey}.${suffixKey}`, translationVariables)
    // since it's not handled errors, we add more details if available
    if (suffixKey === 'description') {
      return error.message ? `${locale} (${error.message})` : locale
    }
    return t(`${defaultKey}.${suffixKey}`, translationVariables)
  }

  return t(`error.job.${error.code}.${suffixKey}`, {
    ...translationVariables,
    _: t(`error.job.${error.type}.${suffixKey}`, {
      ...translationVariables,
      _: t(`${defaultKey}.${suffixKey}`, translationVariables)
    })
  })
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
 * This directly relies on the `fields.advancedFields.folderPath` from manifest for legacy Konnector.
 * Relies on `folders` for new Konnector
 * @param  {Object} konnector
 * @return {bool}   `true` if the konnector needs a folder
 */
export const needsFolder = konnector => {
  return (
    has(konnector, 'fields.advancedFields.folderPath') ||
    has(konnector, 'folders')
  )
}

/**
 * Base directories are directory where konnector may copy their data.
 * They are expressed as variables which then need to be localized.
 * Default is `$administrative`.
 */
const allowedBaseDirVariables = ['$administrative', '$photos']

/**
 * Render base directory, based on given folders object.
 * For example, it will render `$administrative` with the given value passed in
 * folders object. We expect to find in folders a localized value.
 * @param  {String} baseDir base directory variable, expects `$administrative`
 * or `$photos`
 * @param  {Object} folders Object indexing base directory variable with
 * corresponding localized name.
 * @return {String}         Localized directory
 */
const renderBaseDir = (baseDir, folders = {}) => {
  // Look for variable name into folders but without $ prefix
  const renderedBaseDir =
    folders[baseDir.slice(1)] || DEFAULT_LOCALIZED_BASE_DIR
  // Trim `/` and avoid multiple `/` characters with regexp
  return trim(renderedBaseDir.replace(/(\/+)/g, '/'), '/')
}

/**
 * Render the given folder path using the given `variables` object.
 * Available variable are `$konnector` (konnector name) and `$account`
 * (account label, i.e. id or name)
 * @param  {String} path      Path to render
 * @param  {Object} variables Object mapping variable to actual values
 * @return {String}           Rendered path
 */
const renderSubDir = (path, variables = {}) => {
  // Trim `/` and avoid multiple `/` characters with regexp
  const sanitizedPath = trim(path.replace(/(\/+)/g, '/'), '/')

  // Let's get only full variable name limited by '/'. We want to avoid false
  // positive like parsing `$variableInString` to `valueInString`
  const segments = sanitizedPath.split('/')
  return segments
    .map(segment => variables[segment.slice(1)] || segment)
    .join('/')
}

/**
 * Check if the provided Path start withs our allowedBaseDirPath to see
 * @param {String} path
 * @return {Boolean}
 */
const hasBaseDir = path => {
  return allowedBaseDirVariables.some(baseDirVar => {
    return path.startsWith(baseDirVar)
  })
}
/**
 * This method creates the subDir. We can't have an empty subDir, so we set
 * it to our default '$konnector/$account'
 * @param {String} fullPath String containing potentially the defaultDir
 * @param {String} defaultDir String to remove from the fullPath
 */
const buildSubDir = (fullPath, defaultDir) => {
  let buildedSubDir = fullPath.substring(defaultDir.length)
  if (buildedSubDir === '') {
    buildedSubDir = '$konnector/$account'
  }
  return buildedSubDir
}
/**
 * Build folder path for a given konnector and a given account.
 *
 * If konnector.folders[0].defaultDir exists, it is used as default directory.
 *
 * Occurrences of following strings in base directory are replaced by:
 * * `$administrative`: Administrative folder
 * * `$photos`: Photos folder
 *
 * Occurrences of following strings in path are replaced by:
 * * `$account: Account label (id or name)`
 * * `$konnector`: Konnector name
 *
 * If no konnectors.folders[0].defaultDir is set, the default dir used is
 * *  `$administrative/$konnector/$account`
 *
 * @param  {Object} konnector Konnector document
 * @param  {Object} account   Account document
 * @param  {Object} folders   Object containing a mapping from folder
 * identifiers (ex: $administrative) to their localized values (ex:
 * Administratif).
 * @return {String}           The result path
 */

export const buildFolderPath = (konnector, account, folders = {}) => {
  const fullPath = get(
    konnector,
    // For now konnectors are only defining one folder in their folders array
    'folders[0].defaultDir',
    '$administrative/$konnector/$account'
  )
  // Trim `/` and avoid multiple `/` characters with regexp
  let sanitizedPath = trim(fullPath.replace(/(\/+)/g, '/'), '/')
  //If the konnector doesn't have any of our base dir, we set it to $administrative
  if (!hasBaseDir(sanitizedPath)) {
    sanitizedPath = '$administrative/' + sanitizedPath
  }
  /**
   * Now that we have our sanitizedPath, we can split it in two strings
   * * `baseDir` containing the baseDir path
   * * `buildedSubDir` containing the rest of the path (ie the path without baseDir)
   */
  const baseDir = sanitizedPath.split('/', 1)
  const buildedSubDir = buildSubDir(sanitizedPath, baseDir[0])

  const renderedBaseDir = renderBaseDir(baseDir[0], folders)
  const renderedPath = renderSubDir(buildedSubDir, {
    // When adding a new allowed variable here, please keep documentation
    // of `renderSubDir` function up to date.
    konnector: konnector.name,
    account: accounts.getLabel(account)
  })
  return `/${renderedBaseDir}/${renderedPath}`
}
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
  buildFolderPath,
  buildFolderPermission,
  getAccountType,
  needsFolder
}
