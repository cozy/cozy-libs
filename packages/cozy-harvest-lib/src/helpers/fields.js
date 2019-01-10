/**
 * Prepare props to pass to React-Select
 * Options must be consistent and value cannot be ''
 * @param  {props} props Props passed to Cozy-UI <Field /> component
 * @return {[type]}       Sanitized props, ready to be passed to
 */
export const sanitizeSelectProps = props => {
  const { options, value } = props
  const sanitized = { ...props }

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
