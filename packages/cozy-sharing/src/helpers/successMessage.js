import { models } from 'cozy-client'

import { Contact, Group } from '../models'

export const countNewRecipients = (currentRecipients, newRecipients) => {
  const newRecipientsNotAlreadyIncluded = newRecipients.filter(recipient => {
    if (Contact.isContact(recipient)) {
      const email = models.contact.getPrimaryEmail(recipient)
      const cozyUrl = models.contact.getPrimaryCozy(recipient)
      return !currentRecipients.find(
        r =>
          (email && r.email && r.email === email) ||
          (cozyUrl && r.instance && r.instance === cozyUrl)
      )
    }
    return true
  })

  return newRecipientsNotAlreadyIncluded.reduce(
    (acc, recipient) => {
      if (recipient._type === Group.doctype) {
        return {
          ...acc,
          group: acc.group + 1
        }
      } else {
        return {
          ...acc,
          contact: acc.contact + 1
        }
      }
    },
    {
      group: 0,
      contact: 0
    }
  )
}

export const getSuccessMessage = (
  recipientsBefore,
  recipientsAfter,
  documentType
) => {
  if (recipientsAfter.length === 1) {
    const recipient = recipientsAfter[0]
    const email = Contact.isContact(recipient)
      ? models.contact.getPrimaryEmail(recipient)
      : recipient.email
    const cozyUrl = models.contact.getPrimaryCozy(recipient)
    const isContactGroup = recipient._type === Group.doctype

    if (isContactGroup) {
      return [
        `${documentType}.share.shareByEmail.singleGroupSuccess`,
        {
          groupName: recipient.name
        }
      ]
    } else if (email) {
      return [
        `${documentType}.share.shareByEmail.singleContactSuccess`,
        {
          email
        }
      ]
    } else if (cozyUrl) {
      return [
        `${documentType}.share.shareByEmail.singleContactSuccess`,
        {
          email: cozyUrl
        }
      ]
    } else {
      return [
        `${documentType}.share.shareByEmail.contactSuccess`,
        {
          smart_count: 1
        }
      ]
    }
  } else {
    const count = countNewRecipients(recipientsBefore, recipientsAfter)
    if (count.contact > 0 && count.group > 0) {
      return [
        `${documentType}.share.shareByEmail.contactAndGroupSuccess`,
        {
          nbContact: count.contact,
          nbGroup: count.group
        }
      ]
    } else if (count.group > 0) {
      return [
        `${documentType}.share.shareByEmail.groupSuccess`,
        {
          smart_count: count.group
        }
      ]
    } else {
      return [
        `${documentType}.share.shareByEmail.contactSuccess`,
        {
          smart_count: count.contact
        }
      ]
    }
  }
}
