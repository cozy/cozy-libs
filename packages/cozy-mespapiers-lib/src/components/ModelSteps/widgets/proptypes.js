import PropTypes from 'prop-types'

const attrsProptypes = PropTypes.shape({
  name: PropTypes.string,
  inputLabel: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.array,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  mask: PropTypes.string,
  maskPlaceholder: PropTypes.string
})

export const defaultProptypes = {
  attrs: attrsProptypes.isRequired,
  defaultValue: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  setValidInput: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  idx: PropTypes.number
}
