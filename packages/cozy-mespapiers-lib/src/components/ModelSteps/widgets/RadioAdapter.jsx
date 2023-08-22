import React, { Fragment, useEffect, useState } from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import Paper from 'cozy-ui/transpiled/react/Paper'
import TextField from 'cozy-ui/transpiled/react/TextField'

import RadioAdapterItem from './RadioAdapterItem'
import { defaultProptypes } from './proptypes'

const isUserValue = (options, value) => {
  return value && !options.includes(value)
}

const RadioAdapter = ({
  attrs: { name, options, required },
  defaultValue = '',
  setValue,
  setValidInput,
  idx
}) => {
  const [optionValue, setOptionValue] = useState(
    isUserValue(options, defaultValue) ? 'other' : defaultValue
  )
  const [textValue, setTextValue] = useState(
    isUserValue(options, defaultValue) ? defaultValue : ''
  )
  const { t } = useI18n()

  const handleClick = val => {
    setOptionValue(val)
    setValue(prev => ({
      ...prev,
      [name]: val
    }))
  }

  const handleTextChange = e => {
    const currentValue = e.target.value
    setTextValue(currentValue)
    setValue(prev => ({
      ...prev,
      [name]: currentValue
    }))
  }

  /* Set default value */
  useEffect(() => {
    setValue(prev => ({ ...prev, [name]: optionValue }))
  }, [name, setValue, optionValue])

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
