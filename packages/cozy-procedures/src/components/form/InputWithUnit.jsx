import React from 'react'
import PropTypes from 'prop-types'
import { Input, translate, InputGroup, Text } from 'cozy-ui/transpiled/react'

import { isMobileApp } from 'cozy-device-helper'
import getInputProps from './getInputProps'
import { hideNavBar, showNavBar } from './hiddenFeature'

export function InputWithUnit({ onChange, t, ...otherProps }) {
  return (
    <div>
      <InputGroup
        append={<Text className="u-pr-1">{t(otherProps.options.unit)}</Text>}
      >
        <Input
          {...getInputProps(otherProps)}
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
      </InputGroup>
    </div>
  )
}

InputWithUnit.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    unit: PropTypes.string.isRequired
  }).isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(InputWithUnit)
