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

module.exports = {
  validate,
  isOfType
}
