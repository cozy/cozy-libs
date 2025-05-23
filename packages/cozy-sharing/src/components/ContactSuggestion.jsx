import PropTypes from 'prop-types'
import React from 'react'

import { models } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { Contact, Group, getDisplayName, getInitials } from '../models'
import { GroupAvatar } from './Avatar/GroupAvatar'

const ContactModel = models.contact

export const ContactSuggestion = ({ contactOrGroup }) => {
  const { t } = useI18n()
  let avatarText, name, details
  const isContactGroup = contactOrGroup._type === Group.doctype
  if (isContactGroup) {
    name = contactOrGroup.name
    avatarText = 'G'
    details = t('Share.members.count', {
      smart_count: contactOrGroup.members.length.toString()
    })
  } else {
    name = getDisplayName(contactOrGroup)
    avatarText = getInitials(contactOrGroup)
    details = ContactModel.getPrimaryCozy(contactOrGroup)
  }

  return (
    <ListItem button>
      <ListItemIcon>
        {isContactGroup ? (
          <GroupAvatar size="m" />
        ) : (
          <Avatar size="m">{avatarText}</Avatar>
        )}
      </ListItemIcon>
      <ListItemText
        primary={name}
        secondary={details && details !== '' ? details : '-'}
      />
    </ListItem>
  )
}

const newUnknownContactProptypes = PropTypes.shape({
  _type: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
})

ContactSuggestion.propTypes = {
  contactOrGroup: PropTypes.oneOfType([
    Contact.propType,
    Group.propType,
    newUnknownContactProptypes
  ]).isRequired,
  contacts: PropTypes.arrayOf(Contact.propType)
}

export default ContactSuggestion
