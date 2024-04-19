import PropTypes from 'prop-types'
import React from 'react'

import { translate } from 'cozy-ui/transpiled/react'
import SelectBox from 'cozy-ui/transpiled/react/SelectBox'

import getInputProps from './getInputProps'

export const SelectBoxAdapter = ({
  onChange,
  options,
  t,
  value,
  ...otherProps
}) => {
  const { enumOptions, ...otherOptions } = options
  const currentValue = enumOptions.find(o => o.value === value)
  let translatedCurrentValue
  if (currentValue) {
    translatedCurrentValue = {
      ...currentValue,
      label: t(currentValue.label)
    }
  }

  return (
    <SelectBox
      {...getInputProps(otherProps, 'select')}
      {...otherOptions}
      fullwidth
      options={enumOptions.map(option => ({
        ...option,
        label: t(option.label)
      }))}
      onChange={option => onChange(option.value)}
      value={translatedCurrentValue}
    />
  )
}

const ValuePropType = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

SelectBoxAdapter.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    enumOptions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: ValuePropType
      })
    )
  }).isRequired,
  t: PropTypes.func.isRequired,
  value: ValuePropType
}

export default translate()(SelectBoxAdapter)
