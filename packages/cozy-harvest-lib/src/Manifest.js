export const legacyLoginFields = [
  'login',
  'identifier',
  'new_identifier',
  'email'
]

export const roleShouldBeRequired = ['identifier', 'password']

export const legacyEncryptedFields = [
  'secret',
  'dob',
  'code',
  'answer',
  'access_token',
  'refresh_token',
  'appSecret'
]

export const Manifest = {
  sanitize: manifest => {
    let sanitized = JSON.parse(JSON.stringify(manifest))
    if (!sanitized.fields) return sanitized

    sanitized = Manifest.sanitizeIdentifier(sanitized)
    sanitized = Manifest.sanitizeRequired(sanitized)
    sanitized = Manifest.sanitizeEncrypted(sanitized)

    return sanitized
  },

  sanitizeIdentifier: sanitized => {
    let hasIdentifier = false
    for (let fieldName in sanitized.fields)
      if (sanitized.fields[fieldName].role === 'identifier') {
        if (hasIdentifier) delete sanitized.fields[fieldName].role
        else hasIdentifier = true
      }
    if (hasIdentifier) return sanitized

    for (let name of legacyLoginFields)
      if (sanitized.fields[name]) {
        sanitized.fields[name].role = 'identifier'
        return sanitized
      }

    for (let fieldName in sanitized.fields)
      if (sanitized.fields[fieldName].type !== 'password') {
        sanitized.fields[fieldName].role = 'identifier'
        return sanitized
      }

    return sanitized
  },

  sanitizeRequired: sanitized => {
    for (let fieldName in sanitized.fields)
      if (typeof sanitized.fields[fieldName].required !== 'boolean')
        sanitized.fields[fieldName].required = true

    return sanitized
  },

  sanitizeEncrypted: sanitized => {
    for (let fieldName in sanitized.fields)
      if (legacyEncryptedFields.includes(fieldName))
        sanitized.fields[fieldName].encrypted = true

    return sanitized
  }
}

export default Manifest
