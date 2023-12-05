import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const BoxDate = ({ onChange, date, toggle, onToggle, helperText }) => {
  const { t, lang } = useI18n()
  const [locales, setLocales] = useState('')
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

  const handleDateToggle = val => {
    const value = val?.target?.checked ?? val
    onToggle(value)
  }

  const handleOnFocus = () => {
    setDisplayHelper(false)
  }
  const handleOnBlur = () => {
    setDisplayHelper(true)
  }

  return (
    <Box
      borderRadius="0.5rem"
      border="1px solid var(--borderMainColor)"
      marginBottom="0.5rem"
    >
      <List className="u-p-0">
        <ListItem
          button
          size="large"
          ellipsis={false}
          onClick={() => handleDateToggle(!toggle)}
        >
          <ListItemIcon>
            <Icon icon="calendar" />
          </ListItemIcon>
          <ListItemText primary={t('ForwardModal.date.text')} />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={toggle}
              onChange={handleDateToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      {toggle && (
        <div className="u-pt-half u-ph-1 u-pb-1">
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locales}>
            <KeyboardDatePicker
              placeholder="01/01/2022"
              fullWidth
              inputProps={{
                inputMode: 'numeric'
              }}
              KeyboardButtonProps={{
                'aria-label': t('ForwardModal.date.input')
              }}
              value={date}
              error={displayHelper && !!helperText}
              helperText={displayHelper && helperText}
              label={t('ForwardModal.date.input')}
              onChange={onChange}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              inputVariant="outlined"
              cancelLabel={t('common.cancel')}
              format={lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
            />
          </MuiPickersUtilsProvider>
        </div>
      )}
    </Box>
  )
}

BoxDate.propTypes = {
  onChange: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  toggle: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  helperText: PropTypes.string
}

export default BoxDate
