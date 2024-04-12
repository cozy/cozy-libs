import React, { Fragment, useEffect, useState } from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import Paper from 'cozy-ui/transpiled/react/Paper'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import RadioAdapterItem from './RadioAdapterItem'
import { defaultProptypes } from './proptypes'

const isCustomOptionValue = (options, value) => {
  return !!value && !options.includes(value)
}
const getDefaultOptionValue = (options, value) => {
  return isCustomOptionValue(options, value) ? 'other' : value
}
const getDefaultTextValue = (options, value) => {
  return isCustomOptionValue(options, value) ? value : ''
}

const RadioAdapter = ({
  attrs: { name, options, required },
  formDataValue = '',
  setValue,
  setValidInput,
  idx
}) => {
  const [optionValue, setOptionValue] = useState(
    getDefaultOptionValue(options, formDataValue)
  )
  const [textValue, setTextValue] = useState(
    getDefaultTextValue(options, formDataValue)
  )
  const { t } = useI18n()

  const handleClick = val => {
    setOptionValue(val)
    setValue(prev => ({
      ...prev,
      [name]: val !== 'other' ? val : textValue || val
    }))
  }

  const handleTextChange = e => {
    const currentValue = e.target.value
    setTextValue(currentValue)
    setValue(prev => ({
      ...prev,
      [name]: currentValue || optionValue
    }))
  }

  /* Set default value */
  useEffect(() => {
    setValue(prev => ({ ...prev, [name]: textValue || optionValue }))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We don't want to update the value when the text/option changes
  }, [])

  /* Necessary to validate or not the validation button of the current step */
  useEffect(() => {
    setValidInput(prev => ({
      ...prev,
      [idx]: !required || optionValue || textValue
    }))
  }, [idx, setValidInput, optionValue, textValue, required])

  return (
    <Paper>
      <List>
        {options.map((option, index) => (
          <Fragment key={index}>
            <RadioAdapterItem
              option={option}
              onClick={() => handleClick(option)}
              value={optionValue}
            />
            {index !== options.length - 1 && (
              <Divider component="li" variant="inset" />
            )}
          </Fragment>
        ))}
        {optionValue === 'other' && (
          <ListItem>
            <TextField
              type="text"
              variant="outlined"
              label={t('RadioAdapter.otherLabel')}
              value={textValue}
              inputProps={{
                'data-testid': 'TextField-other'
              }}
              onChange={handleTextChange}
              fullWidth
            />
          </ListItem>
        )}
      </List>
    </Paper>
  )
}

RadioAdapter.propTypes = defaultProptypes

export default RadioAdapter
