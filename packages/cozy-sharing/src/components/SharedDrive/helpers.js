import { models } from 'cozy-client'

const ContactModel = models.contact

export const mergeAndDeduplicateRecipients = arrays => {
  const combinedArray = arrays.flat()

  const seenIds = new Set()

  const uniqueArray = combinedArray.filter(item => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id)
      return true
    }
    return false
  })

  return uniqueArray
}

export const formatRecipients = sharedDriveRecipients => {
  const recipients = []

  sharedDriveRecipients.recipients.forEach(r => {
    recipients.push({
      index: `virtual-shared-drive-sharing-${r._id}`,
      email: ContactModel.getPrimaryEmail(r),
      public_name: r.displayName || r.name,
      memberIndex: r._id,
      type: 'two-way',
      members: r.members
    })
  })

  sharedDriveRecipients.readOnlyRecipients.forEach(r => {
    recipients.push({
      index: `virtual-shared-drive-sharing-${r._id}`,
      email: ContactModel.getPrimaryEmail(r),
      public_name: r.displayName || r.name,
      memberIndex: r._id,
      type: 'one-way',
      members: r.members
    })
  })

  // We need to sort recipients by public_name
  // to avoid reording them every time we change
  // them from read only to read write.
  recipients.sort((a, b) => {
    if (a.public_name < b.public_name) {
      return -1
    }
    if (a.public_name > b.public_name) {
      return 1
    }
    return 0
  })

  return recipients
}
