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
