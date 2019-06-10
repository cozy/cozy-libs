import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'cozy-ui/transpiled/react'

import stripInvalidInputProps from './stripInvalidInputProps'
import withLocales from '../../withLocales'

const InputWithUnit = ({ onChange, t, ...otherProps }) => (
  <div>
    <Input
      {...stripInvalidInputProps(otherProps)}
      onChange={e => {
        onChange(e.target.value)
      }}
    />
    <span>{t(otherProps.options.unit)}</span>
  </div>
)

InputWithUnit.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    unit: PropTypes.string.isRequired
  }).isRequired,
  t: PropTypes.func.isRequired
}

export default withLocales(InputWithUnit)
