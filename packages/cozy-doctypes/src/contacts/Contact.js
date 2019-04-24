const PropTypes = require('prop-types')

const Document = require('../Document')

const getPrimaryOrFirst = property => obj => {
  if (!obj[property] || obj[property].length === 0) return ''
  return obj[property].find(property => property.primary) || obj[property][0]
}

class Contact extends Document {
  /**
   * Returns the initials of the contact.
   *
   * @param {Object|string} contact - A contact or a string
   **/
  static getInitials(contact) {
    if (typeof contact === 'string') {
      // eslint-disable-next-line no-console
      console.warn(
        'Passing a string to Contact.getInitials will be deprecated soon.'
      )
      return contact[0].toUpperCase()
    }

    return ['givenName', 'familyName']
      .map(part => contact.name[part] || '')
      .map(name => name[0])
      .join('')
      .toUpperCase()
  }

  /**
   * Returns the contact's main email
   *
   * @param {Object} contact - A contact
   **/
  // TODO: sadly we have different versions of contacts' doctype to handle...
  // A migration tool on the stack side is needed here
  static getPrimaryEmail(contact) {
    return Array.isArray(contact.email)
      ? getPrimaryOrFirst('email')(contact).address
      : contact.email
  }

  /**
   * Returns the contact's main cozy
   *
   * @param {Object} contact - A contact
   **/
  static getPrimaryCozy(contact) {
    return Array.isArray(contact.cozy)
      ? getPrimaryOrFirst('cozy')(contact).url
      : contact.url
  }
}

Contact.doctype = 'io.cozy.contacts'

module.exports = Contact
