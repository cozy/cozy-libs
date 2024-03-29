import get from 'lodash/get'

import flag from 'cozy-flags'

import { Group } from '../models'

export const DEFAULT_DISPLAY_NAME = 'Share.contacts.defaultDisplayName'

export const filterAndReworkRecipients = (recipients, previousRecipients) => {
  return recipients
    .filter(recipient => recipient.status !== 'owner')
    .map(recipient => {
      const recipientHasChanged =
        previousRecipients &&
        !previousRecipients.find(
          previousRecipient =>
            previousRecipient.name === recipient.name &&
            previousRecipient.email === recipient.email
        )

      if (recipientHasChanged) {
        return { ...recipient, hasBeenJustAdded: true }
      }

      return recipient
    })
}

export const FADE_IN_DURATION = 600

/**
 * @returns {boolean} the maximum recipients limit by document
 */
export const computeRecipientsLimit = () => {
  const flagLimit = flag('sharing.recipients-limit')
  if (flagLimit !== null) {
    return flagLimit
  }
  return 100
}

/**
 * @param {object[]} current List of current recipients
 * @param {object[]} next List of next recipients
 * @returns {boolean} whether total number of recipients has reach the limit
 */
export const hasReachRecipientsLimit = (current, next) => {
  const limit = computeRecipientsLimit()
  if (current.length + next.length > limit) {
    return true
  }
  return false
}

/**
 * Merges the recipients list with a new recipient and their associated contacts.
 * @param {object[]} recipients - The list of recipients.
 * @param {object} recipient - The new recipient.
 * @param {object[]} contacts - The list of contacts.
 * @returns {object[]} - The merged recipients list.
 */
export const spreadGroupAndMergeRecipients = (
  recipients,
  newRecipient,
  contacts
) => {
  let contactsToAdd
  if (newRecipient._type === Group.doctype) {
    const groupId = newRecipient.id
    contactsToAdd = contacts.data.filter(contact => {
      const contactGroupIds = get(contact, 'relationships.groups.data', []).map(
        group => group._id
      )

      return contactGroupIds.includes(groupId)
    })
  } else {
    contactsToAdd = [newRecipient]
  }

  const filtered = contactsToAdd
    .filter(
      contact =>
        (contact.email && contact.email.length > 0) ||
        (contact.cozy && contact.cozy.length > 0)
    )
    .filter(contact => !recipients.find(r => r === contact))

  return [...recipients, ...filtered]
}

export const mergeRecipients = (recipients, newRecipient) => {
  return [...recipients, newRecipient]
}

export const getGroupRecipientSecondaryText = ({
  nbMember,
  nbMemberReady,
  t,
  isUserInsideMembers
}) => {
  const memberCount =
    nbMember === nbMemberReady ? nbMember : [nbMemberReady, nbMember].join('/')
  const secondary = t('GroupRecipient.secondary', {
    memberCount,
    smart_count: nbMember
  })

  return (
    secondary +
    (isUserInsideMembers ? ` (${t('GroupRecipient.secondary_you')})` : '')
  )
}
