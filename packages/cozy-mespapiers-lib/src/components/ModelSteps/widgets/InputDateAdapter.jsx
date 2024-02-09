import React, { useState, useEffect } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { DatePicker } from './DatePicker'
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
  formDataValue,
  setValue,
  setValidInput,
  onFocus,
  idx
}) => {
  const { name, inputLabel } = attrs
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const classes = useStyles(isDesktop)
  const [isValidDate, setIsValidDate] = useState(true)
  const [selectedDate, setSelectedDate] = useState(formDataValue || null)

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

  return (
    <DatePicker
      label={inputLabel ? t(inputLabel) : ''}
      placeholder="01/01/2022"
      className={classes.overrides}
      value={selectedDate}
      isValid={setIsValidDate}
      onChange={setSelectedDate}
      onFocus={onFocus}
      helperText={t('InputDateAdapter.invalidDateMessage')}
      inputProps={{
        inputMode: 'numeric'
      }}
      KeyboardButtonProps={{
        'aria-label': t(inputLabel)
      }}
    />
  )
}

InputDateAdapter.propTypes = defaultProptypes

export default InputDateAdapter
