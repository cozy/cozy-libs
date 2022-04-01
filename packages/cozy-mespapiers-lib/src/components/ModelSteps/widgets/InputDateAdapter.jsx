import React, { useState, useEffect } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import PropTypes from 'prop-types'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import { makeStyles } from '@material-ui/styles'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const useStyles = makeStyles(() => ({
  overrides: {
    width: '100%',
    MuiOutlinedInput: {
      '&:focused': {
        notchedOutline: {
          borderColor: 'var(--primaryColor)'
        }
      }
    }
  }
}))

const InputDateAdapter = ({
  attrs,
  defaultValue,
  setValue,
  setValidInput,
  setIsFocus,
  idx
}) => {
  const { name, inputLabel } = attrs
  const { t, lang } = useI18n()
  const classes = useStyles()
  const [locales, setLocales] = useState('')
  const [isValidDate, setIsValidDate] = useState(true)
  const [selectedDate, setSelectedDate] = useState(defaultValue || null)
  const [displayHelper, setDisplayHelper] = useState(false)

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

  const handleDateChange = value => {
    if (value?.toString() !== 'Invalid Date') {
      setSelectedDate(value)
      setIsValidDate(true)
    } else setIsValidDate(false)

    if (value === '') setSelectedDate(null)
  }

  useEffect(() => {
    setValue(prev => ({ ...prev, [name]: selectedDate }))
  }, [name, selectedDate, setValue])

  useEffect(() => {
    setValidInput(prev => ({
      ...prev,
      [idx]: isValidDate
    }))
  }, [idx, isValidDate, setValidInput])

  const handleOnFocus = () => {
    setIsFocus(true)
    setDisplayHelper(false)
  }
  const handleOnBlur = () => {
    setIsFocus(false)
    setDisplayHelper(true)
  }

  return (
    <MuiPickersUtilsProvider
      utils={DateFnsUtils}
      locale={locales}
      className={'TEST'}
    >
      <KeyboardDatePicker
        placeholder={'01/01/2022'}
        className={classes.overrides}
        error={displayHelper && !isValidDate}
        inputProps={{
          inputMode: 'numeric'
        }}
        helperText={
          displayHelper &&
          !isValidDate &&
          t('InputDateAdapter.invalidDateMessage')
        }
        value={selectedDate}
        label={inputLabel ? t(inputLabel) : ''}
        onChange={handleDateChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        inputVariant={'outlined'}
        cancelLabel={t('common.cancel')}
        format={lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
      />
    </MuiPickersUtilsProvider>
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

InputDateAdapter.propTypes = {
  attrs: attrsProptypes.isRequired,
  defaultValue: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  setValidInput: PropTypes.func.isRequired,
  setIsFocus: PropTypes.func.isRequired,
  idx: PropTypes.number
}

export default InputDateAdapter
