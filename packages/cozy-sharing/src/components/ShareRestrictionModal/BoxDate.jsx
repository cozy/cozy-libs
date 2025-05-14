import { format } from 'date-fns'
import PropTypes from 'prop-types'
import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import DatePicker from 'cozy-ui/transpiled/react/DatePicker'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CalendarIcon from 'cozy-ui/transpiled/react/Icons/Calendar'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const BoxDate = ({ onChange, date, toggle, onToggle }) => {
  const { t, lang } = useI18n()
  const formatDate = lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'

  const handleDateToggle = val => {
    const value = val?.target?.checked ?? val
    onToggle(value)
  }

  return (
    <Box borderRadius="0.5rem" border="1px solid var(--borderMainColor)">
      <List className="u-p-0">
        <ListItem
          button
          size="large"
          ellipsis={false}
          onClick={() => handleDateToggle(!toggle)}
        >
          <ListItemIcon>
            <Icon icon={CalendarIcon} />
          </ListItemIcon>
          <ListItemText primary={t('BoxDate.text')} />
          <ListItemSecondaryAction>
            <Switch
              edge="start"
              color="primary"
              checked={toggle}
              onChange={handleDateToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      {toggle && (
        <div className="u-pt-half u-ph-1 u-pb-1">
          <DatePicker
            className="u-w-100"
            enableKeyboard
            label={t('BoxDate.label')}
            placeholder={format(new Date(), formatDate)}
            value={date}
            minDate={new Date()}
            onChange={onChange}
            inputProps={{
              inputMode: 'numeric'
            }}
            KeyboardButtonProps={{
              'aria-label': t('BoxDate.label')
            }}
          />
        </div>
      )}
    </Box>
  )
}

BoxDate.propTypes = {
  onChange: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  toggle: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}
