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

  /**
   * Returns the contact's fullname
   *
   * @param {Object} contact - A contact
   **/
  static getFullname(contact) {
    if (contact.fullname) {
      return contact.fullname
    } else if (contact.name) {
      return [
        'namePrefix',
        'givenName',
        'additionalName',
        'familyName',
        'nameSuffix'
      ]
        .map(part => contact.name[part])
        .filter(part => part !== undefined)
        .join(' ')
        .trim()
    }

    return undefined
  }

  /**
   * Returns a display name for the contact
   *
   * @param {Object} contact - A contact
   **/
  static getDisplayName(contact) {
    return Contact.getFullname(contact) || Contact.getPrimaryEmail(contact)
  }
}

const ContactShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  _type: PropTypes.string.isRequired,
  fullname: PropTypes.string,
  name: PropTypes.shape({
    givenName: PropTypes.string,
    familyName: PropTypes.string,
    additionalName: PropTypes.string,
    namePrefix: PropTypes.string,
    nameSuffix: PropTypes.string
  }),
  birthday: PropTypes.string,
  note: PropTypes.string,
  email: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string,
      primary: PropTypes.bool
    })
  ),
  address: PropTypes.arrayOf(
    PropTypes.shape({
      street: PropTypes.string,
      pobox: PropTypes.string,
      city: PropTypes.string,
      region: PropTypes.string,
      postcode: PropTypes.string,
      country: PropTypes.string,
      type: PropTypes.string,
      primary: PropTypes.bool,
      label: PropTypes.string,
      formattedAddress: PropTypes.string
    })
  ),
  phone: PropTypes.arrayOf({
    number: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    primary: PropTypes.bool
  }),
  cozy: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      label: PropTypes.string,
      primary: PropTypes.bool
    })
  ),
  company: PropTypes.string,
  jobTitle: PropTypes.string,
  trashed: PropTypes.bool,
  me: PropTypes.bool.isRequired,
  relationships: PropTypes.shape({
    accounts: PropTypes.shape({
      data: PropTypes.arrayOf({
        _id: PropTypes.string.isRequired,
        _type: PropTypes.string.isRequired
      })
    }),
    groups: PropTypes.shape({
      data: PropTypes.arrayOf({
        _id: PropTypes.string.isRequired,
        _type: PropTypes.string.isRequired
      })
    })
  })
})

Contact.doctype = 'io.cozy.contacts'
Contact.propType = ContactShape

module.exports = Contact
