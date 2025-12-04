import React from 'react'
import { useI18n, useExtendI18n } from 'twake-i18n'

import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import TextField from 'cozy-ui/transpiled/react/TextField'

import { locales } from './locales'
import { FieldInputWrapperPropTypes } from '../types'

const TextFieldSelect = ({ options, ...props }) => {
  useExtendI18n(locales)
  const { t } = useI18n()

  const _options = [
    ...options.map(option => ({
      ...option,
      label: option.translated ? option.label : t(option.label)
    }))
  ]

  return (
    <TextField {...props}>
      {_options.map((option, index) => {
        return (
          <MenuItem
            key={`${props.name}-${index}`}
            value={option.value}
            onClick={option.onClick}
          >
            {option.label}
          </MenuItem>
        )
      })}
    </TextField>
  )
}

TextFieldSelect.prototype = FieldInputWrapperPropTypes

export default TextFieldSelect
