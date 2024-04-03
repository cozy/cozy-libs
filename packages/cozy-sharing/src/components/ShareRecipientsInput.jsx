import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import { useQueryAll, isQueryLoading } from 'cozy-client'

import ShareAutosuggest from './ShareAutosuggest'
import {
  buildReachableContactsQuery,
  buildContactGroupsQuery
} from '../queries/queries'

const ShareRecipientsInput = ({
  recipients,
  placeholder,
  onPick,
  onRemove
}) => {
  const reachableContactsQuery = buildReachableContactsQuery()
  const reachableContactsResult = useQueryAll(
    reachableContactsQuery.definition,
    reachableContactsQuery.options
  )

  const contactGroupsQuery = buildContactGroupsQuery()
  const contactGroupsResult = useQueryAll(
    contactGroupsQuery.definition,
    contactGroupsQuery.options
  )

  const isLoading =
    isQueryLoading(reachableContactsResult) ||
    reachableContactsResult.hasMore ||
    isQueryLoading(contactGroupsResult) ||
    contactGroupsResult.hasMore

  const contactsAndGroups = useMemo(() => {
    // we need contacts to be loaded to be able to  add all group members to recipients
    if (
      reachableContactsResult.hasMore ||
      reachableContactsResult.fetchStatus === 'loading'
    ) {
      return reachableContactsResult.data
    }

    if (
      !reachableContactsResult.hasMore &&
      reachableContactsResult.fetchStatus === 'loaded' &&
      !contactGroupsResult.hasMore &&
      contactGroupsResult.fetchStatus === 'loaded'
    ) {
      const contactGroupsWithMembers = contactGroupsResult.data
        .map(contactGroup => ({
          ...contactGroup,
          members: reachableContactsResult.data.reduce((members, contact) => {
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

      return [...reachableContactsResult.data, ...contactGroupsWithMembers]
    }

    return []
  }, [reachableContactsResult, contactGroupsResult])

  return (
    <ShareAutosuggest
      loading={isLoading}
      contactsAndGroups={contactsAndGroups}
      recipients={recipients}
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
