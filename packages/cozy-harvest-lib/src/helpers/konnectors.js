import get from 'lodash/get'
import has from 'lodash/has'
import trim from 'lodash/trim'

import { Q, fetchPolicies } from 'cozy-client'

import * as accounts from './accounts'
import { getBoundT } from '../locales'

const DEFAULT_SUPPORT_MAIL = 'claude@cozycloud.cc'

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
const ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED =
  'ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED'

const KNOWN_ERRORS = [
  CHALLENGE_ASKED,
  DISK_QUOTA_EXCEEDED,
  LOGIN_FAILED,
  MAINTENANCE,
  NOT_EXISTING_DIRECTORY,
  TERMS_VERSION_MISMATCH,
  USER_ACTION_NEEDED,
  VENDOR_DOWN,
  ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED
]

const USER_ERRORS = [
  CHALLENGE_ASKED,
  DISK_QUOTA_EXCEEDED,
  LOGIN_FAILED,
  NOT_EXISTING_DIRECTORY,
  USER_ACTION_NEEDED
]

const sanitizeAccountIdentifierRx = /\//g

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
   * @return {Boolean}
   */
  isUserError() {
    return USER_ERRORS.includes(this.type)
  }

  /**
   * Test if the konnector error is due to a term version mismatch. Term version
   * mismatch errors indicates that the konnector must be updated manually
   * @return {Boolean}
   */
  isTermsVersionMismatchError() {
    return this.type === TERMS_VERSION_MISMATCH
  }

  isSolvableViaReconnect() {
    return (
      this.type === LOGIN_FAILED ||
      this.type === CHALLENGE_ASKED ||
      // We did not put the decoupled case (2fa code via app)
      // since we do not currently *need* to display a 2fa modal
      // for the flow to work. There will be no modal displayed
      // but the user will be able to do the 2fa on its mobile phone.
      this.code === 'USER_ACTION_NEEDED.SCA_REQUIRED' ||
      this.code === 'USER_ACTION_NEEDED.WEBAUTH_REQUIRED' ||
      this.code === 'USER_ACTION_NEEDED.OAUTH_OUTDATED' ||
      this.code === 'USER_ACTION_NEEDED.CHANGE_PASSWORD' ||
      this.code === 'VENDOR_DOWN' ||
      this.code === 'VENDOR_DOWN.BANK_DOWN' ||
      this.code === 'VENDOR_DOWN.LINXO_DOWN'
    )
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
export const getErrorLocale = (
  error,
  konnector,
  t,
  suffixKey,
  supportMail = DEFAULT_SUPPORT_MAIL
) => {
  const defaultKey = 'error.job.UNKNOWN_ERROR'
  const translationVariables = {
    name: konnector.name || '',
    link: konnector.vendor_link || '',
    supportMail
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

export const fetchSupportMail = async client => {
  const result = await client.fetchQueryAndGetFromState({
    definition: Q('io.cozy.settings').getById('io.cozy.settings.context'),
    options: {
      as: 'io.cozy.settings/io.cozy.settings.context',
      fetchPolicy: fetchPolicies.olderThan(60 * 60 * 1000)
    }
  })
  return get(result, 'data[0].attributes.support_address', DEFAULT_SUPPORT_MAIL)
}

export const getErrorLocaleBound = (
  error,
  konnector,
  lang,
  suffixKey,
  supportMail
) => {
  const t = getBoundT(lang)
  return getErrorLocale(error, konnector, t, suffixKey, supportMail)
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
 * Returns true if the konnector has a new version available and can be updated
 * @param  {Object}  konnector
 * @return {Boolean}
 */
export const hasNewVersionAvailable = (konnector = {}) =>
  !!konnector.available_version

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
  // If the konnector doesn't have any of our base dir, we set it to $administrative
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
    account: accounts
      .getLabel(account)
      .replace(sanitizeAccountIdentifierRx, '-')
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

/**
 * Define if konnector is disconnected or not
 *
 * @param {Object} konnector - The io.cozy.konnectors object for the current konnector
 * @param {Object} trigger - Associated trigger
 * @returns {Boolean}
 */
export const isDisconnected = (konnector, trigger) => {
  return !!konnector && !trigger
}

export default {
  KonnectorJobError,
  buildFolderPath,
  buildFolderPermission,
  getAccountType,
  hasNewVersionAvailable,
  needsFolder,
  fetchSupportMail,
  DEFAULT_SUPPORT_MAIL
}
