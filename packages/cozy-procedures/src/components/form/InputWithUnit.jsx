import React from 'react'
import PropTypes from 'prop-types'
import { Input, translate, InputGroup, Text } from 'cozy-ui/transpiled/react'

import getInputProps from './getInputProps'

export const InputWithUnit = ({ onChange, t, ...otherProps }) => (
  <div>
    <InputGroup
      append={<Text className="u-pr-1">{t(otherProps.options.unit)}</Text>}
    >
      <Input
        {...getInputProps(otherProps)}
        onChange={e => {
          onChange(e.target.value)
        }}
      />
    </InputGroup>
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
