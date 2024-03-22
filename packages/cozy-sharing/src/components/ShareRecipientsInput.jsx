import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import ShareAutosuggest from './ShareAutosuggest'
import { contactsResponseType, contactGroupsResponseType } from '../propTypes'

const ShareRecipientsInput = ({
  contacts,
  contactGroups,
  recipients,
  placeholder,
  onPick,
  onRemove
}) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (
      loading &&
      !contacts.hasMore &&
      contacts.fetchStatus === 'loaded' &&
      !contactGroups.hasMore &&
      contactGroups.fetchStatus === 'loaded'
    ) {
      setLoading(false)
    }
  }, [contacts, contactGroups, loading])

  const onShareAutosuggestFocus = () => {
    if (
      contacts.hasMore ||
      contacts.fetchStatus === 'loading' ||
      contactGroups.hasMore ||
      contactGroups.fetchStatus === 'loading'
    ) {
      setLoading(true)
    }
  }

  const getContactsAndGroups = () => {
    // we need contacts to be loaded to be able to add all group members to recipients
    if (contacts.hasMore || contacts.fetchStatus === 'loading') {
      return contacts.data
    } else {
      const contactGroupsWithCount = contactGroups.data
        .map(contactGroup => ({
          ...contactGroup,
          membersCount: contacts.data.reduce((total, contact) => {
            if (
              get(contact, 'relationships.groups.data', [])
                .map(group => group._id)
                .includes(contactGroup._id)
            ) {
              return total + 1
            }

            return total
          }, 0)
        }))
        .filter(contactGroup => contactGroup.membersCount > 0)

      return [...contacts.data, ...contactGroupsWithCount]
    }
  }

  return (
    <ShareAutosuggest
      loading={loading}
      contactsAndGroups={getContactsAndGroups()}
      recipients={recipients}
      onFocus={onShareAutosuggestFocus}
      onPick={onPick}
      onRemove={onRemove}
      placeholder={placeholder}
    />
  )
}

ShareRecipientsInput.propTypes = {
  contacts: contactsResponseType.isRequired,
  contactGroups: contactGroupsResponseType.isRequired,
  recipients: PropTypes.array,
  placeholder: PropTypes.string,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

ShareRecipientsInput.defaultProps = {
  recipients: []
}

export default ShareRecipientsInput
