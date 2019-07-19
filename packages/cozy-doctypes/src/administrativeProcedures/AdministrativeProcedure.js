const get = require('lodash/get')
const flatten = require('lodash/flatten')

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
        const path = get(contactField, 'path', field)
        value = get(contact, path)
      }

      if (value !== undefined) {
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

  /**
   * Returns a io.cozy.procedures.administratives object
   *
   * @param {object} data - The data we need for this type of procedure
   * @param {ProcedureTemplate} template - The procedure's template
   * @return {AdministrativeProcedure} the administrative procedure
   */
  static create(data, template) {
    const { documentsData, personalData, procedureData } = data
    const files = Object.keys(documentsData).map(identifier => {
      return documentsData[identifier].files.map(file => {
        //TODO Remove this check. it has to be done before
        if (file)
          return {
            _id: file.id,
            _type: 'io.cozy.files',
            templateDocumentId: identifier
          }
      })
    })
    return {
      personalData,
      procedureData,
      submissionDate: new Date(),
      templateId: template.type,
      templateVersion: template.version,
      relationships: {
        files: {
          data: flatten(files)
        }
      }
    }
  }

  /**
   * Returns json that represents the administative procedure
   *
   * @param {AdministrativeProcedure}
   * @return {string} - the json that represents this procedure
   *
   */
  static createJson(administrativeProcedure) {
    return JSON.stringify(administrativeProcedure)
  }
}

AdministrativeProcedure.doctype = 'io.cozy.procedures.administratives'

module.exports = AdministrativeProcedure
