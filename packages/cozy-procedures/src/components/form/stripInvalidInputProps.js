/*eslint no-unused-vars: off*/
const stripInvalidInputProps = ({
  readonly,
  autofocus,
  formContext,
  rawErrors,
  t,
  f,
  ...otherProps
}) => ({
  readOnly: readonly,
  autoFocus: autofocus,
  ...otherProps
})

export default stripInvalidInputProps
