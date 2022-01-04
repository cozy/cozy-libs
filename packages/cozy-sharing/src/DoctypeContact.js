import { models } from 'cozy-client'
import { Contact as DoctypeContact } from 'cozy-doctypes'

const ContactModel = models.contact

const isContact = candidate => candidate._type === 'io.cozy.contacts'
export const getInitials = (contactOrRecipient, defaultValue = '') => {
  if (isContact(contactOrRecipient)) {
    return ContactModel.getInitials(contactOrRecipient)
  }
  // @todo Extract to RecipientModel ?
  const s =
    contactOrRecipient.public_name ||
    contactOrRecipient.name ||
    contactOrRecipient.email
  return (s && s[0].toUpperCase()) || defaultValue
}

export const getDisplayName = (contact, defaultValue = '') => {
  if (isContact(contact)) {
    return ContactModel.getDisplayName(contact)
  }
  // @todo Extract to RecipientModel ?
  return contact.public_name || contact.name || contact.email || defaultValue
}

export default DoctypeContact
