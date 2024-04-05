import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo } from 'react'

import { useQueryAll } from 'cozy-client'

import ShareAutosuggest from './ShareAutosuggest'
import { buildContactsQuery, buildContactGroupsQuery } from '../queries/queries'

const ShareRecipientsInput = ({
  recipients,
  placeholder,
  onPick,
  onRemove
}) => {
  const [loading, setLoading] = useState(false)

  const contactsQuery = buildContactsQuery()
  const contactsResult = useQueryAll(
    contactsQuery.definition,
    contactsQuery.options
  )

  const contactGroupsQuery = buildContactGroupsQuery()
  const contactGroupsResult = useQueryAll(
    contactGroupsQuery.definition,
    contactGroupsQuery.options
  )

  useEffect(() => {
    if (
      loading &&
      !contactsResult.hasMore &&
      contactsResult.fetchStatus === 'loaded' &&
      !contactGroupsResult.hasMore &&
      contactGroupsResult.fetchStatus === 'loaded'
    ) {
      setLoading(false)
    }
  }, [contactsResult, contactGroupsResult, loading])

  const onShareAutosuggestFocus = () => {
    if (
      contactsResult.hasMore ||
      contactsResult.fetchStatus === 'loading' ||
      contactGroupsResult.hasMore ||
      contactGroupsResult.fetchStatus === 'loading'
    ) {
      setLoading(true)
    }
  }

  const contactsAndGroups = useMemo(() => {
    // we need contacts to be loaded to be able to  add all group members to recipients
    if (contactsResult.hasMore || contactsResult.fetchStatus === 'loading') {
      return contactsResult.data
    }

    if (
      !contactsResult.hasMore &&
      contactsResult.fetchStatus === 'loaded' &&
      !contactGroupsResult.hasMore &&
      contactGroupsResult.fetchStatus === 'loaded'
    ) {
      const contactGroupsWithMembers = contactGroupsResult.data
        .map(contactGroup => ({
          ...contactGroup,
          members: contactsResult.data.reduce((members, contact) => {
            if (
              get(contact, 'relationships.groups.data', [])
                .map(group => group._id)
                .includes(contactGroup._id)
            ) {
              return [...members, contact]
            }

            return members
          }, [])
        }))
        .filter(group => group.members.length > 0)

      return [...contactsResult.data, ...contactGroupsWithMembers]
    }

    return []
  }, [contactsResult, contactGroupsResult])

  return (
    <ShareAutosuggest
      loading={loading}
      contactsAndGroups={contactsAndGroups}
      recipients={recipients}
      onFocus={onShareAutosuggestFocus}
      onPick={onPick}
      onRemove={onRemove}
      placeholder={placeholder}
    />
  )
}

ShareRecipientsInput.propTypes = {
  recipients: PropTypes.array,
  placeholder: PropTypes.string,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

ShareRecipientsInput.defaultProps = {
  recipients: []
}

export default ShareRecipientsInput
