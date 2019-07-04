import React from 'react'
import PropTypes from 'prop-types'
import { Input, translate } from 'cozy-ui/transpiled/react'

import stripInvalidInputProps from './stripInvalidInputProps'
import { hideNavBar, showNavBar } from './hiddenFeature'
import { isMobileApp } from 'cozy-device-helper'
export const InputAdapter = props => (
  <Input
    {...stripInvalidInputProps(props)}
    onChange={e => {
      props.onChange(e.target.value)
    }}
    onBlur={() => {
      if (isMobileApp()) showNavBar()
    }}
    onFocus={() => {
      if (isMobileApp()) hideNavBar()
    }}
  />
)

InputAdapter.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default translate()(InputAdapter)
