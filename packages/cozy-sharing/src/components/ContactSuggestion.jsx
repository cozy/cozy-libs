import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { models } from 'cozy-client'
const ContactModel = models.contact
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Avatar from 'cozy-ui/transpiled/react/Avatar'

import styles from './Recipient/recipient.styl'

import { Contact, Group, getDisplayName, getInitials } from '../models'
import Identity from './Recipient/Identity'

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
    <div className={styles['recipient']}>
      <Avatar text={avatarText} size="small" />
      <Identity name={name} details={details === '' ? undefined : details} />
    </div>
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
