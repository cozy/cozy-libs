import PropTypes from 'prop-types'
import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { DatePicker } from '../ModelSteps/widgets/DatePicker'

const BoxDate = ({ isValid, onChange, date, toggle, onToggle, helperText }) => {
  const { t } = useI18n()

  const handleDateToggle = val => {
    const value = val?.target?.checked ?? val
    onToggle(value)
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
          <DatePicker
            label={t('ForwardModal.date.input')}
            placeholder="01/01/2022"
            value={date}
            isValid={isValid}
            onChange={onChange}
            helperText={helperText}
            inputProps={{
              inputMode: 'numeric'
            }}
            KeyboardButtonProps={{
              'aria-label': t('ForwardModal.date.input')
            }}
          />
        </div>
      )}
    </Box>
  )
}

BoxDate.propTypes = {
  isValid: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  toggle: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  helperText: PropTypes.string
}

export default BoxDate
