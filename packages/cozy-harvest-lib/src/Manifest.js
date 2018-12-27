import _flow from 'lodash/flow'
import _cloneDeep from 'lodash/cloneDeep'

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

const legacyLoginFields = ['login', 'identifier', 'new_identifier', 'email']

/**
 * Ensures that fields has at least one field with the role 'identifier'
 * @param  {Object} [fields={}] Manifest fields
 * @return {Object}             Sanitized manifest fields
 */
const sanitizeIdentifier = fields => {
  const sanitized = _cloneDeep(fields)
  let hasIdentifier = false
  for (let fieldName in sanitized)
    if (sanitized[fieldName].role === 'identifier') {
      if (hasIdentifier) delete sanitized[fieldName].role
      else hasIdentifier = true
    }
  if (hasIdentifier) return sanitized

  for (let name of legacyLoginFields)
    if (sanitized[name]) {
      sanitized[name].role = 'identifier'
      return sanitized
    }

  for (let fieldName in sanitized)
    if (sanitized[fieldName].type !== 'password') {
      sanitized[fieldName].role = 'identifier'
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
  for (let fieldName in sanitized)
    sanitized[fieldName].required =
      typeof sanitized[fieldName].required === 'boolean'
        ? sanitized[fieldName].required
        : true

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
  for (let fieldName in sanitized)
    if (typeof sanitized[fieldName].encrypted !== 'boolean')
      sanitized[fieldName].encrypted = legacyEncryptedFields.includes(fieldName)
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
  sanitize,
  sanitizeFields
}
