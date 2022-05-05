import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import InputMask from 'react-input-mask'

import TextField from 'cozy-ui/transpiled/react/MuiCozyTheme/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  checkConstraintsOfIinput,
  makeConstraintsOfInput
} from '../../../utils/input'

const styleFontMono = 'Segoe UI Mono, SF Mono, Roboto Mono, Courier'

const getInputMode = (inputType, mask) => {
  if (mask) {
    // If the mask attribute contains "*" or "a", it can contain text
    // So on mobile, we want to display the text keyboard
    const hasText = ['*', 'a'].some(t => mask.includes(t))
    return hasText ? 'text' : 'numeric'
  }

  return inputType === 'number' ? 'numeric' : 'text'
}

const InputTextAdapter = ({
  attrs,
  defaultValue,
  setValue,
  setValidInput,
  setIsFocus,
  idx
}) => {
  const {
    name,
    inputLabel,
    mask,
    maskPlaceholder = '_',
    maxLength,
    minLength
  } = attrs
  const { t } = useI18n()
  const [currentValue, setCurrentValue] = useState(defaultValue || '')
  const [isTooShort, setIsTooShort] = useState(false)

  const { inputType, expectedLength, isRequired } = useMemo(
    () => makeConstraintsOfInput(attrs),
    [attrs]
  )
  const isValidInputValue = useMemo(
    () =>
      checkConstraintsOfIinput(currentValue.length, expectedLength, isRequired),
    [currentValue.length, expectedLength, isRequired]
  )

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
      currentValue = targetValue.replaceAll(toReplace, '')
    }

    if (inputType === 'number' && !mask) {
      const parseIntValue = parseInt(currentValue, 10)
      if (/^[0-9]*$/.test(parseIntValue)) {
        setCurrentValue(parseIntValue.toString())
      } else if (currentValue === '') {
        setCurrentValue(currentValue)
      }
    } else {
      setCurrentValue(currentValue)
    }
  }

  const handleOnFocus = () => {
    setIsFocus(true)
    setIsTooShort(false)
  }

  const handleOnBlur = () => {
    setIsFocus(false)
    if (currentValue.length > 0) {
      setIsTooShort(
        expectedLength.min > 0 && currentValue.length < expectedLength.min
      )
    } else setIsTooShort(false)
  }

  const helperText = isTooShort
    ? t('InputTextAdapter.invalidTextMessage', {
        smart_count: expectedLength.min - currentValue.length
      })
    : ''

  if (mask) {
    return (
      <InputMask
        mask={mask}
        maskPlaceholder={maskPlaceholder}
        value={currentValue}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      >
        <TextField
          type="text"
          variant="outlined"
          label={inputLabel ? t(inputLabel) : ''}
          error={isTooShort}
          helperText={helperText}
          inputProps={{
            style: { fontFamily: styleFontMono },
            inputMode: getInputMode(inputType, mask),
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
      label={inputLabel ? t(inputLabel) : ''}
      error={isTooShort}
      helperText={helperText}
      value={currentValue}
      inputProps={{
        maxLength: maxLength,
        minLength: minLength,
        inputMode: getInputMode(inputType),
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

const attrsProptypes = PropTypes.shape({
  name: PropTypes.string,
  inputLabel: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  mask: PropTypes.string,
  maskPlaceholder: PropTypes.string
})

InputTextAdapter.propTypes = {
  attrs: attrsProptypes.isRequired,
  defaultValue: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  setValidInput: PropTypes.func.isRequired,
  setIsFocus: PropTypes.func.isRequired,
  idx: PropTypes.number
}

export default InputTextAdapter
