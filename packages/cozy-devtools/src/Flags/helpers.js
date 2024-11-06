import flag from 'cozy-flags'

const human = name => {
  return name.replace(/[a-z][A-Z]/g, str => str[0] + ' ' + str[1].toLowerCase())
}

export const makeHumanValue = value => {
  return typeof value === 'object' ? JSON.stringify(value) : value.toString()
}

export const computeFlags = () => {
  return flag.list().map(name => {
    const value = flag(name)
    return {
      key: `flag__${name}`,
      name,
      type: typeof value,
      humanName: human(name),
      value,
      humanValue: makeHumanValue(value)
    }
  })
}

export const isJSONString = str => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}
