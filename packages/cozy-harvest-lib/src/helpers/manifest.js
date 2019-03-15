import _flow from 'lodash/flow'
import _cloneDeep from 'lodash/cloneDeep'
import findKey from 'lodash/findKey'
import _mapValues from 'lodash/mapValues'
import _pickBy from 'lodash/pickBy'

export const ROLE_IDENTIFIER = 'identifier'

/**
 * We defined "predefined labels", as labels wich can be used in manifest, to
 * refer to existing locales.
 * @example
 * This declaration expect that applications resolve automatically the label
 * of the field "name", without relying on locales declared in konnector
 * manifest.
 * ```
 * "fields": {
 *   "name": {
 *     "label": "firsname",
 *     "type": "text"
 *   }
 * }
 * ```
 */
export const predefinedLabels = [
  'answer',
  'birthdate',
  'code',
  'date',
  'email',
  'firstname',
  'lastname',
  'login',
  'password',
  'phone'
]

/**
 * Out of scope labels already used, should be transferred directly in manifests
 * in the future.
 */
export const legacyLabels = [
  'branchName' // Used in banking konnectors
]

/**
 * Legacy login fields declared by some konnectors
 */
const legacyLoginFields = ['login', 'identifier', 'new_identifier', 'email']

/**
 * Returns a key/value object with field as key and default, if it exists in
 * fields parameter.
 * @example
 * ```
 * const fields = {
 *   username: {
 *      type: "text"
 *   },
 *   favoriteColor: {
 *      default: "green"
 *      type: "text"
 *   }
 * }
 * const result = defaultFieldsValues(fields)
 * ```
 * `result` here is
 * ```
 * {
 *    favoriteColor: "green"
 * }
 * ```
 * Def
 * @param  {object} fields Fields object from manifest
 * @return {object}        key/value pairs of default values
 */
const defaultFieldsValues = fields => {
  return _mapValues(
    _pickBy(fields, value => !!value.default),
    value => value.default
  )
}

/**
 * Returns the key for the field having the role=identifier attribute
 * @param  {Object} fields Konnector fields
 * @return {[type]}        The key for the identifier field, example 'login'
 */
const getIdentifier = (fields = {}) =>
  findKey(sanitizeIdentifier(fields), field => field.role === ROLE_IDENTIFIER)

/**
 * Ensures old fields are removed
 * @param  {Object} fields Manifest fields
 * @return {Object}        Sanitized manifest fields
 */
const removeOldFields = fields => {
  const sanitized = _cloneDeep(fields)
  delete sanitized.advancedFields
  return sanitized
}

/**
 * Ensures that fields has at least one field with the role 'identifier'
 * @param  {Object} [fields={}] Manifest fields
 * @return {Object}             Sanitized manifest fields
 */
const sanitizeIdentifier = fields => {
  const sanitized = _cloneDeep(fields)
  let hasIdentifier = false
  for (let fieldName in sanitized)
    if (sanitized[fieldName].role === ROLE_IDENTIFIER) {
      if (hasIdentifier) delete sanitized[fieldName].role
      else hasIdentifier = true
    }
  if (hasIdentifier) return sanitized

  for (let name of legacyLoginFields)
    if (sanitized[name]) {
      sanitized[name].role = ROLE_IDENTIFIER
      return sanitized
    }

  for (let fieldName in sanitized)
    if (sanitized[fieldName].type !== 'password') {
      sanitized[fieldName].role = ROLE_IDENTIFIER
      return sanitized
    }

  return sanitized
}

/**
 * Ensures every field not explicitely tagged as not required is required
 * @param  {Object} [fields={}] Manifest fields
 * @return {Object}             Sanitized manifest fields
 */
const sanitizeRequired = fields => {
  const sanitized = _cloneDeep(fields)
  for (let fieldName in sanitized) {
    const field = sanitized[fieldName]
    // Ensure legacy for field isRequired
    const required =
      typeof field.required === 'undefined' ? field.isRequired : field.required
    sanitized[fieldName].required =
      typeof required === 'boolean' ? required : true
  }

  return sanitized
}

const legacyEncryptedFields = [
  'secret',
  'dob',
  'code',
  'answer',
  'access_token',
  'refresh_token',
  'appSecret'
]

/**
 * Ensures:
 * * any field flagged as encrypted keeps its flag
 * * any legacy encrypted field is tagged as encrypted
 * @param  {Object} [fields={}] Manifest fields
 * @return {Object}             Sanitized Manifest fields
 */
const sanitizeEncrypted = fields => {
  const sanitized = _cloneDeep(fields)
  for (let fieldName in sanitized) {
    const field = sanitized[fieldName]
    if (typeof field.encrypted !== 'boolean')
      field.encrypted =
        field.type === 'password' || legacyEncryptedFields.includes(fieldName)
  }
  return sanitized
}

/* flow() is like compose() but not in reverse order */
const sanitizeFields = _flow([
  removeOldFields,
  sanitizeIdentifier,
  sanitizeRequired,
  sanitizeEncrypted
])

export const sanitize = (manifest = {}) =>
  manifest.fields
    ? {
        ...manifest,
        fields: sanitizeFields(manifest.fields)
      }
    : manifest

export default {
  defaultFieldsValues,
  getIdentifier,
  sanitize,
  sanitizeFields
}
