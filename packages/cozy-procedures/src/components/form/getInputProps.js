/*eslint no-unused-vars: off*/
const getInputProps = (
  {
    readonly,
    autofocus,
    formContext,
    options = {},
    rawErrors,
    schema,
    t,
    f,
    ...otherProps
  },
  widget = 'input'
) => {
  const inputProps = {
    readOnly: readonly,
    autoFocus: autofocus,
    ...otherProps
  }

  if (widget === 'select') {
    inputProps.options = options
    return inputProps
  }

  // If options.inputType is set use that as the input type
  if (options.inputType) {
    inputProps.type = options.inputType
    // If the schema is of type number or integer, set the input type to number
  } else if (!inputProps.type) {
    if (schema.type === 'number') {
      inputProps.type = 'number'
      // Setting step to 'any' fixes a bug in Safari where decimals are not
      // allowed in number inputs
      inputProps.step = 'any'
    } else if (schema.type === 'integer') {
      inputProps.type = 'number'
      // Since this is integer, you always want to step up or down in multiples
      // of 1
      inputProps.step = '1'
    } else {
      inputProps.type = 'text'
    }
  }

  if (schema.minimum !== undefined) {
    inputProps.min = schema.minimum
  }

  if (schema.maximum !== undefined) {
    inputProps.max = schema.maximum
  }

  // If multipleOf is defined, use this as the step value. This mainly improves
  // the experience for keyboard users (who can use the up/down KB arrows).
  if (schema.multipleOf) {
    inputProps.step = schema.multipleOf
  }

  return inputProps
}

export default getInputProps
