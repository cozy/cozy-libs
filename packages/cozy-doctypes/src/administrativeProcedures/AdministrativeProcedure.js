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
      address: {
        getter: Contact.getPrimaryAddress
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
  /**
   * Method to generate a query based on a few rules given by the template
   * @param {Object} docRules
   * @param {Object} docRules.rules
   * @param {int} docRules.count
   */
  static async getFilesByRules(docRules) {
    const { rules, count } = docRules
    const cozyRules = {
      trashed: false,
      type: 'file',
      ...rules
    }
    //Create an index in order to query and sort
    await this.cozyClient
      .collection('io.cozy.files')
      .createIndex(['metadata.datetime', 'metadata.classification'])
    //Use the index
    const files = await this.cozyClient
      .collection('io.cozy.files')
      .find(cozyRules, {
        indexedFields: ['metadata.datetime', 'metadata.classification'],
        sort: [
          {
            'metadata.datetime': 'desc'
          },
          {
            'metadata.classification': 'desc'
          }
        ],
        limit: count ? count : 1
      })

    return files
  }
}

AdministrativeProcedure.doctype = 'io.cozy.procedures.administratives'

module.exports = AdministrativeProcedure
