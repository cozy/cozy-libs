import { validateEmail } from './email'

// Return the contact object if present
// Else check if a contact exist with this email address, if yes return it
// if not create it
export const getOrCreateFromArray = async (client, contacts, createContact) =>
  await Promise.all(
    contacts.map(async contact => {
      if (contact.id) {
        return contact
      }
      if (validateEmail(contact.email)) {
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
        }
        const resp = await createContact({
          email: [{ address: contact.email, primary: true }]
        })
        return resp.data
      }
    })
  )
