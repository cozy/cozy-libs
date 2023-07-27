import flag from 'cozy-flags'

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
