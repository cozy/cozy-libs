const PropTypes = require('prop-types')
const get = require('lodash/get')

const log = require('../log')
const Document = require('../Document')

const getPrimaryOrFirst = property => obj => {
  if (!obj[property] || obj[property].length === 0) return ''
  return obj[property].find(property => property.primary) || obj[property][0]
}

/**
 * Class representing the contact model.
 * @extends Document
 */
class Contact extends Document {
  /**
   * Returns true if candidate is a contact
   *
   * @param {Object} candidate
   * @return {boolean} - whether the candidate is a contact
   */
  static isContact(candidate) {
    return candidate._type === Contact.doctype
  }

  /**
   * Returns the initials of the contact.
   *
   * @param {Contact|string} contact - A contact or a string
   * @return {string} - the contact's initials
   */
  static getInitials(contact) {
    if (typeof contact === 'string') {
      log(
        'warn',
        'Passing a string to Contact.getInitials will be deprecated soon.'
      )
      return contact[0].toUpperCase()
    }

    if (contact.name) {
      return ['givenName', 'familyName']
        .map(part => get(contact, ['name', part, 0], ''))
        .join('')
        .toUpperCase()
    }

    const email = Contact.getPrimaryEmail(contact)
    if (email) {
      return email[0].toUpperCase()
    }

    log('warn', 'Contact has no name and no email.')
    return ''
  }

  /**
   * Returns the contact's main email
   *
   * @param {Contact} contact - A contact
   * @return {string} - The contact's main email
   */
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
   * @param {Contact} contact - A contact
   * @return {string} - The contact's main cozy
   */
  static getPrimaryCozy(contact) {
    return Array.isArray(contact.cozy)
      ? getPrimaryOrFirst('cozy')(contact).url
      : contact.url
  }

  /**
   * Returns the contact's main phone number
   *
   * @param {Contact} contact - A contact
   * @return {string} - The contact's main phone number
   */
  static getPrimaryPhone(contact) {
    return getPrimaryOrFirst('phone')(contact).number
  }

  /**
   * Returns the contact's main address
   *
   * @param {Contact} contact - A contact
   * @return {string} - The contact's main address
   */
  static getPrimaryAddress(contact) {
    return getPrimaryOrFirst('address')(contact).formattedAddress
  }

  /**
   * Returns the contact's fullname
   *
   * @param {Contact} contact - A contact
   * @return {string} - The contact's fullname
   */
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
   * @param {Contact} contact - A contact
   * @return {string} - the contact's display name
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
  phone: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.string.isRequired,
      type: PropTypes.string,
      label: PropTypes.string,
      primary: PropTypes.bool
    })
  ),
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
  me: PropTypes.bool,
  relationships: PropTypes.shape({
    accounts: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          _type: PropTypes.string.isRequired
        })
      )
    }),
    groups: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          _type: PropTypes.string.isRequired
        })
      )
    })
  })
})

Contact.doctype = 'io.cozy.contacts'
Contact.propType = ContactShape

module.exports = Contact
