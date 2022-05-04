import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import TextField from 'cozy-ui/transpiled/react/MuiCozyTheme/TextField'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  checkConstraintsOfIinput,
  makeConstraintsOfInput
} from '../../../utils/input'

const acceptEntry = (value, expectedLength) => {
  return expectedLength.max >= expectedLength.min && expectedLength.max > 0
    ? value.length <= expectedLength.max
    : true
}

const InputTextAdapter = ({
  attrs,
  defaultValue,
  setValue,
  setValidInput,
  setIsFocus,
  idx
}) => {
  const { name, inputLabel, ...otherInputProps } = attrs
  const { t } = useI18n()
  const [currentValue, setCurrentValue] = useState(defaultValue || '')
  const [isTooShort, setIsTooShort] = useState(false)

  const { inputType, expectedLength, isRequired } = useMemo(
    () => makeConstraintsOfInput(otherInputProps),
    [otherInputProps]
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
  const handleOnChange = useCallback(
    evt => {
      const { value: targetValue } = evt.target

      if (inputType === 'number') {
        const parseIntValue = parseInt(targetValue, 10)
        if (/^[0-9]*$/.test(parseIntValue)) {
          if (acceptEntry(targetValue, expectedLength)) {
            setCurrentValue(parseIntValue.toString())
          }
        } else if (targetValue === '') setCurrentValue(targetValue)
      } else {
        if (acceptEntry(targetValue, expectedLength)) {
          setCurrentValue(targetValue)
        }
      }
    },
    [expectedLength, inputType]
  )

  const handleOnFocus = () => {
    setIsFocus(true)
    setIsTooShort(false)
  }

  const handleOnBlur = () => {
    setIsFocus(false)
    if (currentValue.length > 0) {
      setIsTooShort(
        expectedLength.min > 0 && currentValue.length < expectedLength.min
  }

  const helperText = isTooShort
    ? t('InputTextAdapter.invalidTextMessage', {
        smart_count: expectedLength.min - currentValue.length
      })
    : ''

  return (
    <TextField
      value={currentValue}
      inputType={inputType}
      error={isTooShort}
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      helperText={helperText}
      inputProps={{
        inputMode: inputType === 'number' ? 'numeric' : 'text'
      }}
      onChange={handleOnChange}
      variant={'outlined'}
      label={inputLabel ? t(inputLabel) : ''}
      fullWidth
      required={isRequired}
    />
  )
}

const attrsProptypes = PropTypes.shape({
  name: PropTypes.string,
  inputLabel: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number
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
