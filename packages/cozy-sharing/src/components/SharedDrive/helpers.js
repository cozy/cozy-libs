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
      email: ContactModel.getPrimaryEmail(r),
      public_name: r.public_name,
      memberIndex: r._id,
      type: 'two-way'
    })
  })

  sharedDriveRecipients.readOnlyRecipients.forEach(r => {
    recipients.push({
      email: ContactModel.getPrimaryEmail(r),
      public_name: r.public_name,
      memberIndex: r._id,
      type: 'one-way'
    })
  })

  return recipients
}
