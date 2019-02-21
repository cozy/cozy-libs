const ENCRYPTED_PLACEHOLDER = '*************'

/**
 * Returns the encrypted fied name as it is computed by the cozy-stack.
 * Cozy-stack encrypt both fields named `login` and `password` together into
 * a property named `credentials_encrypted`.
 * Any other named field is encrypted "alone" into a property named
 * `${name}_encrypted`, ${name} being here the original name
 *
 * @param  {string} name Field name form manifest
 * @return {string}      Encrypted property name
 */
export const getEncryptedFieldName = name => {
  if (name === 'password') return 'credentials_encrypted'
  return `${name}_encrypted`
}

/**
 * If the field is encrypted and has an initial value, return a placeholder
 * that indicate that the value exists.
 *
 * @param  {object} props AccountField component props
 * @return {string}       The encrypted placeholder or en empty string if the
 *                        field does not need encrypted placeholder
 */
export const getFieldPlaceholder = (props, fallback) => {
  const { encrypted, initialValue, placeholder } = props
  return (
    (encrypted && initialValue && ENCRYPTED_PLACEHOLDER) ||
    placeholder ||
    fallback ||
    ''
  )
}

/**
 * Prepare props to pass to React-Select
 * Options must be consistent and value cannot be ''
 * @param  {props} props Props passed to Cozy-UI <Field /> component
 * @return {[type]}       Sanitized props, ready to be passed to
 */
export const sanitizeSelectProps = props => {
  const { options, value } = props
  const sanitized = { ...props }
  // Disable key up for selects
  delete sanitized.onKeyUp

  sanitized.options = options
    ? options.map(option => ({
        ...option,
        // legacy
        label: option.label || option.name
      }))
    : []

  // We cannot pass an empty string as value to React-Select, or no value is
  // never displayed in the select.
  // `false` is an accepted value.
  if (typeof value !== 'undefined') {
    sanitized.value = sanitized.options.find(o => o.value === value)
  }

  sanitized.type = 'select'
  return sanitized
}

export default {
  sanitizeSelectProps
}
