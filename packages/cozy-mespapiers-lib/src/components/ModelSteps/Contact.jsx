import React from 'react'

import { models } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Radio from 'cozy-ui/transpiled/react/Radios'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'

const { getFullname } = models.contact

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

const Contact = ({
  contact,
  multiple,
  contactIdsSelected,
  setContactIdsSelected
}) => {
  const { t } = useI18n()

  const onClickContactLine = val => {
    const newValue = val?.target?.value || val

    if (multiple) {
      const newContactIdSelected = [...contactIdsSelected]
      const find = newContactIdSelected.indexOf(newValue)

      if (find > -1) newContactIdSelected.splice(find, 1)
      else newContactIdSelected.push(newValue)

      setContactIdsSelected(newContactIdSelected)
    } else {
      setContactIdsSelected([newValue])
    }
  }

  return (
    <ListItem
      button
      key={contact._id}
      onClick={() => onClickContactLine(contact._id)}
    >
      <ListItemIcon>
        <Avatar size={'small'} style={styleAvatar} />
      </ListItemIcon>
      <ListItemText
        primary={`${getFullname(contact)} ${
          contact.me ? `(${t('ContactStep.me')})` : ''
        }`}
      />
      <ListItemSecondaryAction className={'u-mr-half'}>
        {multiple ? (
          <Checkbox
            checked={contactIdsSelected.includes(contact._id)}
            onChange={onClickContactLine}
            value={contact._id}
            name="checkbox-contactsList"
          />
        ) : (
          <Radio
            checked={contactIdsSelected.includes(contact._id)}
            onChange={onClickContactLine}
            value={contact._id}
            name="radio-contactsList"
          />
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default Contact
