import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'

import { models } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { Contact, Group, getDisplayName, getInitials } from '../models'

const ContactModel = models.contact

export const ContactSuggestion = ({ contactOrGroup, contacts }) => {
  const { t } = useI18n()
  let avatarText, name, details
  if (contactOrGroup._type === Group.doctype) {
    name = contactOrGroup.name
    const membersCount = contacts
      .reduce((total, contact) => {
        if (
          get(contact, 'relationships.groups.data', [])
            .map(group => group._id)
            .includes(contactOrGroup._id)
        ) {
          return total + 1
        }

        return total
      }, 0)
      .toString()
    details = t('Share.members.count', {
      smart_count: membersCount
    })
    avatarText = 'G'
  } else {
    name = getDisplayName(contactOrGroup)
    avatarText = getInitials(contactOrGroup)
    details = ContactModel.getPrimaryCozy(contactOrGroup)
  }

  return (
    <ListItem button>
      <ListItemIcon>
        <Avatar text={avatarText} size="small" />
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
