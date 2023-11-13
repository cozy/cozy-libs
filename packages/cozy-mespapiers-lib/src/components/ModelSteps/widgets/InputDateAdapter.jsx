import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import React, { useState, useEffect } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { defaultProptypes } from './proptypes'

const useStyles = makeStyles(() => ({
  overrides: {
    width: '100%',
    height: isDesktop => (isDesktop ? '5rem' : 'inehrit'),
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
  const { isDesktop } = useBreakpoints()
  const classes = useStyles(isDesktop)
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

  /* Set default value */
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
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locales}>
      <KeyboardDatePicker
        placeholder="01/01/2022"
        className={classes.overrides}
        error={displayHelper && !isValidDate}
        inputProps={{
          inputMode: 'numeric'
        }}
        KeyboardButtonProps={{
          'aria-label': t(inputLabel)
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
        inputVariant="outlined"
        cancelLabel={t('common.cancel')}
        format={lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
      />
    </MuiPickersUtilsProvider>
  )
}

InputDateAdapter.propTypes = defaultProptypes

export default InputDateAdapter
