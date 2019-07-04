import React from 'react'
import PropTypes from 'prop-types'
import { Input, translate } from 'cozy-ui/transpiled/react'

import stripInvalidInputProps from './stripInvalidInputProps'
import { hideNavBar, showNavBar } from './hiddenFeature'
import { isMobileApp } from 'cozy-device-helper'

export const InputWithUnit = ({ onChange, t, ...otherProps }) => (
  <div>
    <Input
      {...stripInvalidInputProps(otherProps)}
      onChange={e => {
        onChange(e.target.value)
      }}
      onBlur={() => {
        if (isMobileApp()) showNavBar()
      }}
      onFocus={() => {
        if (isMobileApp()) hideNavBar()
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

export default translate()(InputWithUnit)
