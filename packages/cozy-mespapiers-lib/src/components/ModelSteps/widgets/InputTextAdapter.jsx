import React, { useState, useEffect, useMemo } from 'react'
import InputMask from 'react-input-mask'

import TextField from 'cozy-ui/transpiled/react/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { makeInputAdornment } from './helpers'
import { defaultProptypes } from './proptypes'
import {
  checkConstraintsOfIinput,
  makeConstraintsOfInput
} from '../../../utils/input'

const styleFontMono = 'Segoe UI Mono, SF Mono, Roboto Mono, Courier'

const getInputMode = (inputType, mask, currentDefinition) => {
  if (mask) {
    // If the mask attribute contains "*" or "a", it can contain text
    // So on mobile, we want to display the text keyboard
    const hasText = ['*', 'a'].some(t => mask.includes(t))
    return hasText ? 'text' : 'numeric'
  }

  // Quick win, if other paper requires this type of condition we will have to review the approach at a higher level, via a new type for example
  return inputType === 'number' && currentDefinition?.label !== 'pay_sheet'
    ? 'numeric'
    : 'text'
}

const InputTextAdapter = ({
  attrs,
  formDataValue,
  currentDefinition,
  setValue,
  setValidInput,
  onFocus,
  idx
}) => {
  const {
    name,
    inputLabel,
    maxLength,
    mask,
    adornment,
    maskPlaceholder = 'ˍ',
    defaultValue
  } = attrs
  const { t } = useI18n()
  const [currentValue, setCurrentValue] = useState(
    formDataValue || defaultValue?.toString() || ''
  )
  const [isTooShort, setIsTooShort] = useState(false)
  const [hasOnlySpaces, setHasOnlySpaces] = useState(false)
  const isError = isTooShort || hasOnlySpaces

  const { inputType, expectedLength, isRequired } = useMemo(
    () => makeConstraintsOfInput(attrs),
    [attrs]
  )

  const isValidInputValue = useMemo(
    () =>
      checkConstraintsOfIinput({
        valueLength: currentValue.length,
        expectedLength,
        isRequired,
        isError
      }),
    [currentValue.length, expectedLength, isRequired, isError]
  )

  /* Set default value */
  useEffect(() => {
    setValue(prev => ({ ...prev, [name]: currentValue }))
  }, [name, setValue, currentValue])

  useEffect(() => {
    setValidInput(prev => ({
      ...prev,
      [idx]: isValidInputValue
    }))
  }, [idx, isValidInputValue, setValidInput])

  /*
  Fix to force Safari to accept only numbers in a field normally of type number
  We simulate the "number" field from a "text" field for at least 2 reasons:
    - Text entries in a "number" field are possible and are not visible in the "value" attribute
    - Avoid poor integration of the "number" field (control arrows on the right in the field)
  The "inputMode" is important to trigger the right keyboard on iOS > 12.1
  */
  const handleOnChange = evt => {
    const { value: targetValue } = evt.target
    let currentValue = targetValue

    if (mask) {
      const toReplace = new RegExp(`\\s|${maskPlaceholder}`, 'g')
      currentValue = targetValue.replace(toReplace, '')
    }

    if (inputType === 'number' && !mask) {
      // Quick win, if other paper requires this type of condition we will have to review the approach at a higher level, via a new type for example
      const regex =
        currentDefinition?.label === 'pay_sheet'
          ? /^[0-9]+([.,][0-9]{0,2})?$/
          : /^[0-9]*$/
      if (regex.test(currentValue)) {
        setCurrentValue(currentValue)
      } else if (currentValue === '') {
        setCurrentValue(currentValue)
      }
    } else {
      // regex: contains only spaces
      if (currentValue.length !== 0 && currentValue.match(/^\s*$/)) {
        setHasOnlySpaces(true)
      } else {
        setHasOnlySpaces(false)
      }
      setCurrentValue(currentValue)
    }
  }

  const handleOnFocus = () => {
    onFocus(true)
    setIsTooShort(false)
  }

  const handleOnBlur = () => {
    onFocus(false)
    if (isRequired || currentValue.length !== 0) {
      setIsTooShort(
        expectedLength.min != null && currentValue.length < expectedLength.min
      )
    } else {
      setIsTooShort(false)
    }
  }

  const helperText = isTooShort
    ? t('InputTextAdapter.invalidTextMessage', {
        smart_count: expectedLength.min - currentValue.length
      })
    : hasOnlySpaces
      ? t('InputTextAdapter.onlySpaces')
      : ' '

  const labelOption = maxLength ? { maxLength } : undefined
  const label = inputLabel ? t(inputLabel, labelOption) : ''

  if (mask) {
    return (
      <InputMask
        mask={mask}
        maskPlaceholder={maskPlaceholder}
        alwaysShowMask
        value={currentValue}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      >
        <TextField
          type="text"
          variant="outlined"
          label={label}
          error={isError}
          helperText={helperText}
          inputProps={{
            style: {
              fontFamily: styleFontMono,
              caretColor: 'var(--primaryTextColor)',
              textAlign: 'center',
              paddingLeft: '12px',
              paddingRight: '12px',
              transition: 'color 0.5s',
              color: currentValue
                ? 'var(--primaryTextColor)'
                : 'var(--hintTextColor)'
            },
            inputMode: getInputMode(inputType, mask, currentDefinition),
            'data-testid': 'InputMask-TextField-input'
          }}
          required={isRequired}
          fullWidth
        />
      </InputMask>
    )
  }

  return (
    <TextField
      type="text"
      variant="outlined"
      label={label}
      error={isError}
      helperText={helperText}
      value={currentValue}
      {...(adornment && {
        InputProps: {
          ...makeInputAdornment({
            adornment,
            smartcount: currentValue,
            t
          })
        }
      })}
      inputProps={{
        maxLength: expectedLength.max,
        minLength: expectedLength.min,
        inputMode: getInputMode(inputType, null, currentDefinition),
        'data-testid': 'TextField-input'
      }}
      onChange={handleOnChange}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      required={isRequired}
      fullWidth
    />
  )
}

InputTextAdapter.propTypes = defaultProptypes

export default InputTextAdapter
