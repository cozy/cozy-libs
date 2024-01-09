import React, { useState, useEffect, useMemo } from 'react'
import InputMask from 'react-input-mask'

import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { defaultProptypes } from './proptypes'
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

const makeInputAdornment = (adornment, currentValue, t) => {
  const result = {}
  Object.entries(adornment).map(([adornmentPosition, adornmentValue]) => {
    if (!['start', 'end'].includes(adornmentPosition)) return

    result[`${adornmentPosition}Adornment`] = (
      <InputAdornment position={adornmentPosition}>
        <Typography>
          {t(adornmentValue, { smart_count: currentValue })}
        </Typography>
      </InputAdornment>
    )
  })
  return result
}

const InputTextAdapter = ({
  attrs,
  formDataValue,
  setValue,
  setValidInput,
  setIsFocus,
  idx
}) => {
  const {
    name,
    inputLabel,
    maxLength,
    mask,
    withAdornment,
    maskPlaceholder = 'ˍ',
    defaultValue
  } = attrs
  const { t } = useI18n()
  const [currentValue, setCurrentValue] = useState(
    defaultValue?.toString() || formDataValue || ''
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
      const parseIntValue = parseInt(currentValue, 10)
      if (/^[0-9]*$/.test(parseIntValue)) {
        setCurrentValue(parseIntValue.toString())
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
    setIsFocus(true)
    setIsTooShort(false)
  }

  const handleOnBlur = () => {
    setIsFocus(false)
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
      label={label}
      error={isError}
      helperText={helperText}
      value={currentValue}
      {...(withAdornment && {
        InputProps: {
          ...makeInputAdornment(withAdornment, currentValue, t)
        }
      })}
      inputProps={{
        maxLength: expectedLength.max,
        minLength: expectedLength.min,
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

InputTextAdapter.propTypes = defaultProptypes

export default InputTextAdapter
