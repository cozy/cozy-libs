import log from 'cozy-logger'

/**
 * @typedef {object} MakeConstraintsOfInputParam
 * @property {'text'|'number'} [type] - A string specifying the type of input
 * @property {boolean} [required] - Indicates that the user must specify a value for the input
 * @property {number} [minLength] - Defines the minimum number of characters can enter into the input
 * @property {number} [maxLength] - Defines the maximum number of characters can enter into the input
 */

/**
 * Make type and length properties
 * @param {MakeConstraintsOfInputParam} attrs - Definition of type & length of the input
 * @example
 * // For make input number with contraint length to 12
 * makeConstraintsOfInput({ type: 'number', minLength: 12, maxLength: 12 })
 * // For make input text with no contraint length
 * makeConstraintsOfInput()
 * // For make input number with contraint length to 12 & required & size to 15
 * makeConstraintsOfInput({ type: 'number', required: true, minLength: 12, maxLength: 12, size: 15 })
 *
 * @returns {{ inputType: string, expectedLength: { min: number, max: number }, isRequired: boolean }}
 */
export const makeConstraintsOfInput = attrs => {
  const { type = '', required = false, mask } = attrs || {}

  const maskLength = mask?.replaceAll(/\s/g, '')?.length
  const minLength = (required && maskLength) || (attrs?.minLength ?? null)
  const maxLength = maskLength ?? attrs?.maxLength ?? null
  const acceptedTypes = ['number', 'text']

  const result = {
    inputType: '',
    expectedLength: {
      min: minLength,
      max: maxLength
    },
    isRequired: required
  }

  if (!acceptedTypes.includes(type.toLowerCase())) {
    log(
      'warn',
      `'type' in 'attributes' property is not defined or unexpected, 'type' set to ${acceptedTypes[1]} by default'`
    )
    result.inputType = acceptedTypes[1]
  } else result.inputType = type

  return result
}

/**
 * @param {number} valueLength - Length of input value
 * @param {number} expectedLength - Expected length of the input value
 * @param {boolean} isRequired - If value is required
 * @returns {boolean}
 */
export const checkConstraintsOfIinput = (
  valueLength,
  expectedLength,
  isRequired
) => {
  const { min, max } = expectedLength

  return [
    valueLength !== 0 || !isRequired,
    valueLength === 0 || min == null || valueLength >= min,
    valueLength === 0 || max == null || valueLength <= max
  ].every(Boolean)
}
