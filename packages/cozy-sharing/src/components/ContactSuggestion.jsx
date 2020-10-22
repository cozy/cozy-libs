import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { models } from 'cozy-client'
const ContactModel = models.contact
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Avatar from 'cozy-ui/transpiled/react/Avatar'

import styles from './recipient.styl'

import { Contact, Group, getDisplayName, getInitials } from '../models'
import Identity from './Identity'

export const ContactSuggestion = ({ contactOrGroup, contacts, t }) => {
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
      <Identity name={name} details={details} />
    </div>
  )
}

ContactSuggestion.propTypes = {
  contactOrGroup: PropTypes.oneOfType([Contact.propType, Group.propType])
    .isRequired,
  contacts: PropTypes.arrayOf(Contact.propType),
  t: PropTypes.func.isRequired
}

export default translate()(ContactSuggestion)
