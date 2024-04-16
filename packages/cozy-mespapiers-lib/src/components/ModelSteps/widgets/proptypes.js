import PropTypes from 'prop-types'

const attrsProptypesOptionTextFieldAttrs = PropTypes.shape({
  type: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  adornment: PropTypes.shape({
    endAdornment: PropTypes.string,
    startAdornment: PropTypes.string
  })
})

export const attrsProptypesOption = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  textFieldAttrs: attrsProptypesOptionTextFieldAttrs
})

const attrsProptypesWithOption = PropTypes.shape({
  name: PropTypes.string,
  inputLabel: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.arrayOf(attrsProptypesOption)),
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  mask: PropTypes.string,
  maskPlaceholder: PropTypes.string
})

export const defaultProptypes = {
  attrs: attrsProptypesWithOption.isRequired,
  defaultValue: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  setValidInput: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  idx: PropTypes.number
}
