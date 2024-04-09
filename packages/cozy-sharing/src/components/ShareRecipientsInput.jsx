import PropTypes from 'prop-types'
import React from 'react'

import { useQueryAll, isQueryLoading } from 'cozy-client'
import flag from 'cozy-flags'

import ShareAutosuggest from './ShareAutosuggest'
import { getContactsFromGroupId } from '../helpers/contacts'
import {
  buildReachableContactsQuery,
  buildContactGroupsByIdsQuery,
  buildUnreachableContactsWithGroupsQuery
} from '../queries/queries'

/**
 * ShareRecipientsInput is responsible for fetching contacts and groups.
 * We retrieve all the contacts that are reachable and the groups they belong to.
 * In order to display the total number of members in each group, we also retrieve the contacts that are not reachable.
 */
const ShareRecipientsInput = ({
  currentRecipients,
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

  const unreachableContactsWithGroupsQuery =
    buildUnreachableContactsWithGroupsQuery()
  const unreachableContactsWithGroupsResult = useQueryAll(
    unreachableContactsWithGroupsQuery.definition,
    {
      ...unreachableContactsWithGroupsQuery.options,
      enabled: !!flag('sharing.show-recipient-groups')
    }
  )

  const contactGroupsByIdsQuery = buildContactGroupsByIdsQuery([
    ...new Set(
      (reachableContactsResult.data || []).flatMap(contact => {
        return (contact.relationships?.groups?.data || []).map(
          group => group._id
        )
      })
    )
  ])
  const contactGroupsByIdsResult = useQueryAll(
    contactGroupsByIdsQuery.definition,
    contactGroupsByIdsQuery.options
  )

  const isLoading =
    isQueryLoading(reachableContactsResult) ||
    reachableContactsResult.hasMore ||
    isQueryLoading(contactGroupsByIdsResult) ||
    contactGroupsByIdsResult.hasMore ||
    (flag('sharing.show-recipient-groups') &&
      (isQueryLoading(unreachableContactsWithGroupsResult) ||
        unreachableContactsWithGroupsResult.hasMore))

  const currentRecipientGroups = currentRecipients
    .map(({ id }) => id)
    .filter(Boolean)
  const contactGroups = (contactGroupsByIdsResult.data || [])
    .filter(
      ({ _id }) =>
        !flag('sharing.show-recipient-groups') ||
        !currentRecipientGroups.includes(_id)
    )
    .map(contactGroup => {
      const reachableMembers = getContactsFromGroupId(
        reachableContactsResult.data,
        contactGroup.id
      ).map(contact => ({
        ...contact,
        isReachable: true
      }))

      if (flag('sharing.show-recipient-groups') !== true) {
        return {
          ...contactGroup,
          members: reachableMembers
        }
      }

      const unreachableMembers = getContactsFromGroupId(
        unreachableContactsWithGroupsResult.data,
        contactGroup.id
      ).map(contact => ({
        ...contact,
        isReachable: false
      }))

      return {
        ...contactGroup,
        members: [...reachableMembers, ...unreachableMembers]
      }
    })

  const contactsAndGroups = [
    ...(reachableContactsResult.data || []),
    ...contactGroups
  ]

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
  currentRecipients: PropTypes.array,
  recipients: PropTypes.array,
  placeholder: PropTypes.string,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

ShareRecipientsInput.defaultProps = {
  currentRecipients: [],
  recipients: []
}

export default ShareRecipientsInput
