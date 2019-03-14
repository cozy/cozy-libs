export const isBoolean = [
  bool => typeof bool === 'undefined' || typeof bool === 'boolean',
  'should be a boolean'
]

export const isRequired = [attr => !!attr, 'is required']

export const isRequiredIfNo = keys => [
  (attr, obj) => keys.find(key => !!obj[key]) || !!attr,
  `is required if no attribute ${keys.join(' or ')} are provider.`
]

export const isString = [
  str => typeof str === 'undefined' || typeof str === 'string',
  'should be a string'
]

export const isURL = [
  url => {
    if (typeof url === 'undefined') return true
    try {
      new URL(url)
    } catch (error) {
      return false
    }

    return true
  },
  'should be an URL'
]

export class Validator {
  static create(...args) {
    return new Validator(...args)
  }

  constructor(types) {
    this.validate = obj => {
      for (const [attr, rules] of Object.entries(types)) {
        for (const [validator, message] of rules) {
          if (!validator(obj[attr], obj)) {
            throw new Error(`${attr} ${message}.`)
          }
        }
      }
    }
  }
}

export default Validator
