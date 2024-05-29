import get from 'lodash/get'

import { harmonizeContactsNames } from '../components/Papers/helpers'
import { BILLS_DOCTYPE } from '../doctypes'

/**
 * @param {object} params
 * @param {string[]} params.filenameModel - Array of property of paerDefinition
 * @param {string} params.contactName - Name of contact
 * @param {string} params.filename - Name of the file
 * @param {string} [params.formatedDate] - Date already formated
 * @param {object} [params.metadata] - Object with data provided by the user (eg: labelGivenByUser)
 */
const buildFilenameWithModel = ({
  filenameModel,
  contactName,
  filename,
  formatedDate,
  metadata,
  pageName
}) => {
  return filenameModel
    .map(el => {
      switch (el) {
        case 'label':
          return filename
        case 'page':
          return pageName
        case 'contactName':
          return contactName
        case 'featureDate':
          return formatedDate
        default:
          return get(metadata, el)
      }
    })
    .filter(Boolean)
}

/**
 * Builded Paper name with qualification name & without use filename original
 * @param {object} params
 * @param {string} params.contacts - Array of contacts
 * @param {object} params.qualification - Qualification of the paper
 * @param {string} params.qualification.name - Name of the paper qualification
 * @param {string} params.qualification.label - Label of the paper qualification
 * @param {Array<string>} [params.filenameModel] - Array of key for build filename
 * @param {object} [params.metadata] - Object with data of Information input
 * @param {string} [params.pageName] - Name of page (eg Front)
 * @param {string} [params.formatedDate] - Date already formated
 * @returns {string} Paper name with PDF extension
 */
export const buildFilename = ({
  contacts,
  qualification,
  filenameModel,
  metadata,
  pageName,
  formatedDate,
  t
}) => {
  /*
    Calling the stack's file creation method would trigger a `status: "422", title: "Invalid Parameter"` error if filename contains`/`.
    So we need to remove any occurrence of this character from the filename.
  */
  const safeFileName = qualification.name.replace(/\//g, '_')
  let contactName = harmonizeContactsNames(contacts, t)

  const filename = [safeFileName]

  if (metadata?.[BILLS_DOCTYPE]?.subtype) {
    filename.push(metadata[BILLS_DOCTYPE].subtype)
  }

  if (pageName) filename.push(pageName)

  if (
    qualification.label === 'vehicle_registration' &&
    metadata?.vehicle?.licenseNumber
  ) {
    filename.push(metadata.vehicle.licenseNumber)
  }

  if (contactName) filename.push(contactName)

  if (formatedDate) filename.push(formatedDate)

  if (filenameModel?.length > 0) {
    const filenameWithModel = buildFilenameWithModel({
      filenameModel,
      contactName,
      filename: safeFileName,
      formatedDate,
      metadata,
      pageName
    })

    if (filenameWithModel.length > 0) {
      return `${filenameWithModel.join(' - ')}.pdf`
    }
  }

  if (filename.length > 1) {
    return `${filename.join(' - ')}.pdf`
  }

  return `${filename.join()}.pdf`
}
