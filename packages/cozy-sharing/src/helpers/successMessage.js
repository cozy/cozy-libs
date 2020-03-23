import { Contact } from '../models'

export const countNewRecipients = (currentRecipients, newRecipients) => {
  return newRecipients.filter(contact => {
    const email = Contact.getPrimaryEmail(contact)
    const cozyUrl = Contact.getPrimaryCozy(contact)
    return !currentRecipients.find(
      r =>
        (email && r.email && r.email === email) ||
        (cozyUrl && r.instance && r.instance === cozyUrl)
    )
  }).length
}

export const getSuccessMessage = (
  recipientsBefore,
  recipientsAfter,
  documentType
) => {
  if (recipientsAfter.length === 1) {
    const recipient = recipientsAfter[0]
    const email = Contact.isContact(recipient)
      ? Contact.getPrimaryEmail(recipient)
      : recipient.email
    const cozyUrl = Contact.getPrimaryCozy(recipient)

    if (email) {
      return [
        `${documentType}.share.shareByEmail.success`,
        {
          email
        }
      ]
    } else if (cozyUrl) {
      return [
        `${documentType}.share.shareByEmail.success`,
        {
          email: cozyUrl
        }
      ]
    } else {
      return [
        `${documentType}.share.shareByEmail.genericSuccess`,
        {
          count: 1
        }
      ]
    }
  } else {
    return [
      `${documentType}.share.shareByEmail.genericSuccess`,
      {
        count: countNewRecipients(recipientsBefore, recipientsAfter)
      }
    ]
  }
}
