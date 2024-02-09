import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import isBefore from 'date-fns/isBefore'
import subDays from 'date-fns/subDays'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const DatePicker = ({
  className,
  label,
  value,
  placeholder,
  isValid,
  onChange,
  onBlur,
  onFocus,
  hideError,
  helperText,
  minDate,
  format,
  cancelLabel,
  inputVariant,
  inputProps,
  KeyboardButtonProps
}) => {
  const [locales, setLocales] = useState('')
  const [displayHelper, setDisplayHelper] = useState(false)
  const [isValidDate, setIsValidDate] = useState(true)

  const { t, lang } = useI18n()

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const src = require(`date-fns/locale/${lang}/index.js`)
      isMounted && setLocales(src)
    })()

    return () => {
      isMounted = false
    }
  }, [lang])

  const handleDateChange = val => {
    if (val?.toString() !== 'Invalid Date') {
      if (minDate && isBefore(val, subDays(minDate, 1))) {
        setIsValidDate(false)
        isValid(false)
        return
      }
      setIsValidDate(true)
      isValid(true)
      onChange(val)
    } else if (val === '') {
      setIsValidDate(true)
      isValid(true)
      onChange(null)
    } else {
      setIsValidDate(false)
      isValid(false)
      onChange(val)
    }
  }

  const handleOnFocus = () => {
    onFocus(true)
    onBlur(false)
    setDisplayHelper(false)
  }
  const handleOnBlur = () => {
    onBlur(true)
    onFocus(false)
    setDisplayHelper(true)
  }

  const isError = !hideError && displayHelper && !isValidDate
  const _helperText = isError ? helperText : ''
  const _format = format || (lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy')
  const _cancelLabel = cancelLabel || t('common.cancel')
  const _KeyboardButtonProps = {
    'aria-label': label,
    ...KeyboardButtonProps
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locales}>
      <KeyboardDatePicker
        className={className}
        placeholder={placeholder}
        label={label}
        value={value}
        cancelLabel={_cancelLabel}
        onChange={handleDateChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        error={isError}
        helperText={_helperText}
        inputProps={inputProps}
        KeyboardButtonProps={_KeyboardButtonProps}
        minDate={minDate}
        inputVariant={inputVariant}
        format={_format}
      />
    </MuiPickersUtilsProvider>
  )
}

DatePicker.defaultProps = {
  onBlur: () => {},
  onFocus: () => {},
  isValid: () => {},
  onChange: () => {},
  value: null,
  inputVariant: 'outlined'
}

DatePicker.prototype = {
  /*
    Classname to override the input style
  */
  className: PropTypes.string,
  /*
    Label of the input
  */
  label: PropTypes.string,
  /*
    Value of th input. If set by default with a Date, isValidDate will be false if the value is empty (KeyboardDatePicker behavior)
  */
  value: PropTypes.string,
  /*
    Placeholder of the input
  */
  placeholder: PropTypes.string,
  /*
    Function that returns if the value of the input is a valid Date
  */
  isValid: PropTypes.func,
  /*
    Function that returns the value of the input
  */
  onChange: PropTypes.func,
  /*
    Function that returns if the input is blured
  */
  onBlur: PropTypes.func,
  /*
    Function that returns if the input is focused
  */
  onFocus: PropTypes.func,
  /*
    Hide the error message
  */
  hideError: PropTypes.bool,
  /*
    Helper text to display when the input is in error
  */
  helperText: PropTypes.string,
  /*
    Min date selectable with the date picker (exclusive)
  */
  minDate: PropTypes.oneOf([PropTypes.string, PropTypes.instanceOf(Date)]),
  /*
    Format of the date
  */
  format: PropTypes.string,
  /*
    Date picker cancellation label
  */
  cancelLabel: PropTypes.string,
  /*
    Variant of the input
  */
  inputVariant: PropTypes.string,
  /*
    Props to override the input
  */
  inputProps: PropTypes.object,
  /*
    Props to override the keyboard button
  */
  KeyboardButtonProps: PropTypes.object
}
