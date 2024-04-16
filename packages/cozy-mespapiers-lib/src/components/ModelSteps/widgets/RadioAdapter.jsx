import React, { Fragment, useEffect, useState } from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import Paper from 'cozy-ui/transpiled/react/Paper'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import RadioAdapterItem from './RadioAdapterItem'
import { defaultProptypes } from './proptypes'

/**
 * @param {import('../../../types').PaperDefinitionStepAttributeOptions[]} options
 * @param {string} value
 * @returns {boolean}
 */
const isCustomOptionValue = (options, value) => {
  return !!value && !options.flat().some(opt => opt.value === value)
}

/**
 * @param {import('../../../types').PaperDefinitionStepAttributeOptions[]} options
 * @param {string} value
 * @returns {import('../../../types').PaperDefinitionStepAttributeOptions}
 */
const getDefaultOption = (options, value) => {
  if (isCustomOptionValue(options, value)) {
    return options.flat().find(opt => !!opt.textFieldAttrs)
  }
  return (
    options.flat().find(opt => opt.value === value) ||
    options.flat().find(opt => opt.checked)
  )
}

/**
 * @param {import('../../../types').PaperDefinitionStepAttributeOptions[]} options
 * @param {string} value
 * @returns {string}
 */
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
  const [{ textFieldAttrs, value: currentOptionValue }, setCurrentOption] =
    useState(getDefaultOption(options, formDataValue) || {})
  const [textValue, setTextValue] = useState(
    getDefaultTextValue(options, formDataValue)
  )
  const { t } = useI18n()

  const handleClick = opt => {
    setCurrentOption(opt)
    setValue(prev => ({
      ...prev,
      [name]: opt.textFieldAttrs ? textValue || opt.value : opt.value
    }))
  }

  const handleText = value => {
    setTextValue(value)
    setValue(prev => ({
      ...prev,
      [name]: value || currentOptionValue
    }))
  }

  const handleTextChange = e => {
    const currentValue = e.target.value
    if (textFieldAttrs.type === 'number') {
      // To force Safari to accept only numbers (regex: numbers or empty values accepted)
      if (/^(?:[0-9]*|)$/.test(currentValue)) {
        handleText(currentValue)
      }
    } else {
      handleText(currentValue)
    }
  }

  /* Set default value */
  useEffect(() => {
    setValue(prev => ({ ...prev, [name]: textValue || currentOptionValue }))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We don't want to update the value when the text/option changes
  }, [])

  /* Necessary to validate or not the validation button of the current step */
  useEffect(() => {
    setValidInput(prev => ({
      ...prev,
      [idx]:
        (!required && !textFieldAttrs?.required) ||
        (!!currentOptionValue && !textFieldAttrs?.required) ||
        !!textValue
    }))
  }, [
    idx,
    setValidInput,
    currentOptionValue,
    textValue,
    required,
    textFieldAttrs
  ])

  return options.map((optionGroup, indexOptionGroup) => (
    <Paper key={indexOptionGroup}>
      <List>
        {optionGroup.map((option, indexOption) => (
          <Fragment key={`'${indexOptionGroup}${indexOption}`}>
            <RadioAdapterItem
              option={option}
              onClick={() => handleClick(option)}
              value={currentOptionValue}
            />
            {option.textFieldAttrs && textFieldAttrs && (
              <ListItem>
                <TextField
                  variant="outlined"
                  label={t(textFieldAttrs.label)}
                  value={textValue}
                  inputProps={{
                    'data-testid': 'TextField-other',
                    inputMode:
                      textFieldAttrs.type === 'number' ? 'numeric' : 'text'
                  }}
                  onChange={handleTextChange}
                  required={textFieldAttrs.required}
                  fullWidth
                />
              </ListItem>
            )}
            {indexOption !== optionGroup.length - 1 && (
              <Divider component="li" variant="inset" />
            )}
          </Fragment>
        ))}
      </List>
    </Paper>
  ))
}

RadioAdapter.propTypes = defaultProptypes

export default RadioAdapter
