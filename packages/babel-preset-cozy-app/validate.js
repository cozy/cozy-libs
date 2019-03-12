const isOfType = type => (value, key) => {
  if (!(typeof value === type)) {
    throw new Error(`Error: "${key}" must be a ${type}`)
  }
}

const validate = (obj, validators) => {
  for (const key of Object.keys(obj)) {
    const validator = validators[key]
    if (validator) {
      validator(obj[key], key)
    }
  }
}

const deprecated = (fn, msg) => (value, key) => {
  if (value !== undefined) {
    // eslint-disable-next-line no-console
    console.warn(key, 'is deprecated.', msg)
  }
}

module.exports = {
  validate,
  isOfType,
  deprecated
}
