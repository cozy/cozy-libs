import PropTypes from 'prop-types'
import React from 'react'

import { useClient, useQueryAll, isQueryLoading } from 'cozy-client'
import { models } from 'cozy-client'
import flag from 'cozy-flags'

import ShareAutosuggest from './ShareAutosuggest'
import { getContactsFromGroupId, suggestContacts } from '../helpers/contacts'
import {
  buildReachableContactsQuery,
  buildContactGroupsQuery,
  buildUnreachableContactsWithGroupsQuery
} from '../queries/queries'

const ContactModel = models.contact

/**
 * ShareRecipientsInput is responsible for fetching contacts and groups.
 * We retrieve all the contacts that are reachable and the groups they belong to.
 * In order to display the total number of members in each group, we also retrieve the contacts that are not reachable.
 * With sharing.contacts-suggest.enabled, the stack suggests the contacts and we only retrieve the group members.
 */
const isCurrentUser = contact => contact.me === true

const ShareRecipientsInput = ({
  currentRecipients,
  recipients,
  placeholder,
  onPick,
  onRemove,
  enableCreateContact,
  disabled,
  autoFocus,
  endAdornment
}) => {
  const client = useClient()
  const isSuggestEnabled = !!flag('sharing.contacts-suggest.enabled')

  const reachableContactsQuery = buildReachableContactsQuery({
    inGroups: isSuggestEnabled
  })
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

  const contactGroupsQuery = buildContactGroupsQuery()
  const contactGroupsResult = useQueryAll(
    contactGroupsQuery.definition,
    contactGroupsQuery.options
  )

  const isLoading =
    isQueryLoading(reachableContactsResult) ||
    reachableContactsResult.hasMore ||
    isQueryLoading(contactGroupsResult) ||
    contactGroupsResult.hasMore ||
    (flag('sharing.show-recipient-groups') &&
      (isQueryLoading(unreachableContactsWithGroupsResult) ||
        unreachableContactsWithGroupsResult.hasMore))

  const reachableContacts = (reachableContactsResult.data || []).filter(
    contact =>
      !isCurrentUser(contact) &&
      // We do not want contact already in the sharing
      !currentRecipients.find(
        r => r.email === ContactModel.getPrimaryEmail(contact)
      ) &&
      // We do not want contact currently in pending contacts (in chips)
      !recipients.find(r => r._id === contact._id)
  )

  const unreachableContactsWithGroups = (
    unreachableContactsWithGroupsResult.data || []
  ).filter(contact => !isCurrentUser(contact))
  const currentRecipientGroups = currentRecipients
    .map(({ id }) => id)
    .filter(Boolean)
  const contactGroups = (contactGroupsResult.data || [])
    .filter(
      ({ _id }) =>
        !flag('sharing.show-recipient-groups') ||
        !currentRecipientGroups.includes(_id)
    )
    .map(contactGroup => {
      const reachableMembers = getContactsFromGroupId(
        reachableContacts,
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
        unreachableContactsWithGroups,
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

  const contactsAndGroups = isSuggestEnabled
    ? contactGroups
    : [...reachableContacts, ...contactGroups]

  const isRecipient = email =>
    currentRecipients.some(r => r.email === email) ||
    recipients.some(r => ContactModel.getPrimaryEmail(r) === email)

  const fetchContacts = async q =>
    (await suggestContacts(client, q)).filter(
      contact => !isRecipient(ContactModel.getPrimaryEmail(contact))
    )

  return (
    <ShareAutosuggest
      loading={isLoading}
      disabled={disabled}
      contactsAndGroups={contactsAndGroups}
      recipients={recipients}
      onPick={onPick}
      onRemove={onRemove}
      enableCreateContact={enableCreateContact}
      placeholder={placeholder}
      autoFocus={autoFocus}
      endAdornment={endAdornment}
      fetchContacts={isSuggestEnabled ? fetchContacts : undefined}
    />
  )
}

ShareRecipientsInput.propTypes = {
  currentRecipients: PropTypes.array,
  recipients: PropTypes.array,
  placeholder: PropTypes.string,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  enableCreateContact: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  endAdornment: PropTypes.node
}

ShareRecipientsInput.defaultProps = {
  currentRecipients: [],
  recipients: []
}

export default ShareRecipientsInput
