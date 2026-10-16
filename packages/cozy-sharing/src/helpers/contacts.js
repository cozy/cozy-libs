import { models } from 'cozy-client'
import flag from 'cozy-flags'

import { validateEmail } from '../helpers/email'
import { DOCTYPE_CONTACTS, DOCTYPE_GROUPS } from '../models'

// Return the contact object if present
// Else check if a contact exist with this email address, if yes return it
// if not create it
// With sharing.contacts-suggest.enabled, people are sent by email and the
// stack finds or creates the contact: an org member's id is not on this instance
export const getOrCreateFromArray = async (client, contacts, createContact) => {
  if (flag('sharing.contacts-suggest.enabled')) {
    return contacts.map(contact => {
      if (contact._type === DOCTYPE_GROUPS) return contact
      const email = models.contact.getPrimaryEmail(contact)
      if (validateEmail(email)) return { _type: DOCTYPE_CONTACTS, email }
      return contact._id ? contact : undefined
    })
  }

  return await Promise.all(
    contacts.map(async contact => {
      if (contact.id) {
        return contact
      } else if (validateEmail(contact.email)) {
        const matchedContact = await client.collection('io.cozy.contacts').find(
          {
            email: {
              $elemMatch: {
                address: contact.email
              }
            },
            _id: {
              $gt: null
            }
          },
          {
            indexedFields: ['_id']
          }
        )

        if (matchedContact.data.length > 0) {
          // We take the shortcut that if we have sevaral contacts
          // with the same address, we take the first one for now
          return matchedContact.data[0]
        } else {
          const resp = await createContact({
            email: [{ address: contact.email, primary: true }]
          })
          return resp.data
        }
      }
    })
  )
}

// A suggestion without id has no contact document, and only a fullname,
// which getDisplayName does not read
export const suggestContacts = async (client, q) => {
  const { data } = await client
    .getStackClient()
    .fetchJSON('GET', `/contacts/suggest?q=${encodeURIComponent(q)}`)
  return data.map(({ id, type, attributes }) => ({
    ...attributes,
    ...(id ? { _id: id, id } : { displayName: attributes.fullname }),
    _type: type
  }))
}

export const getContactsFromGroupId = (contacts = [], groupId) => {
  return contacts.filter(contact => {
    return contact.relationships?.groups?.data?.some(
      group => group._id === groupId
    )
  })
}

/**
 * Returns true when a contact does not exist. A contact without
 * an `_id` is always a placeholder that must be created before sharing.
 *
 * Used to decide whether the autosuggest input should allow creating
 * a new contact on the fly or should block the pick (depending on the
 * `enableCreateContact` flag).
 */
export const isContactToBeCreated = contact => {
  return !contact._id
}
