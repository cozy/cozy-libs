const get = require('lodash/get')

const Contact = require('../contacts/Contact')
const Document = require('../Document')

class AdministrativeProcedure extends Document {
  /**
   * Returns personal data for the contact
   *
   * @param {Contact} contact - A contact
   * @param {Array} fields - The list of fields to retrieve
   * @return {Object} - the personal data
   **/
  static getPersonalData(contact, fields) {
    const mapping = {
      firstname: {
        path: 'name.givenName'
      },
      lastname: {
        path: 'name.familyName'
      },
      email: {
        getter: Contact.getPrimaryEmail
      },
      phone: {
        getter: Contact.getPrimaryPhone
      }
    }
    let personalData = {}
    fields.forEach(field => {
      const contactField = get(mapping, field, field)
      let value
      if (contactField.getter) {
        value = contactField.getter(contact)
      } else {
        value = get(contact, contactField.path)
      }

      if (value) {
        personalData[field] = value
      }
    })

    return personalData
  }
}

AdministrativeProcedure.doctype = 'io.cozy.procedures.administratives'

module.exports = AdministrativeProcedure
