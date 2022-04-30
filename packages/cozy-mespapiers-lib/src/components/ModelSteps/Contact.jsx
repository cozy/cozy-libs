import React from 'react'

import { models } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Radio from 'cozy-ui/transpiled/react/Radio'

const { getFullname } = models.contact

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

const Contact = ({ contact, contactIdSelected, setContactIdSelected }) => {
  const { t } = useI18n()

  const onChangeRadio = evt => setContactIdSelected(evt.target.value)

  return (
    <ListItem
      button
      key={contact._id}
      onClick={() => setContactIdSelected(contact._id)}
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
        <Radio
          checked={contactIdSelected === contact._id}
          onChange={onChangeRadio}
          value={contact._id}
          name="radio-contactsList"
        />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default Contact
