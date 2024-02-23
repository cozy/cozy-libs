import PropTypes from 'prop-types'
import React from 'react'

import { isMobileApp } from 'cozy-device-helper'
import { Input, translate } from 'cozy-ui/transpiled/react'

import getInputProps from './getInputProps'
import { hideNavBar, showNavBar } from './hiddenFeature'

export const InputAdapter = props => (
  <Input
    {...getInputProps(props)}
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
