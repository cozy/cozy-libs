import { harmonizeContactsNames } from '../components/Papers/helpers'

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
          return metadata?.[el]
      }
    })
    .filter(Boolean)
}

/**
 * Builded Paper name with qualification name & without use filename original
 * @param {object} params
 * @param {string} params.contacts - Array of contacts
 * @param {string} params.qualificationName - Name of the paper qualification
 * @param {Array<string>} [params.filenameModel] - Array of key for build filename
 * @param {object} [params.metadata] - Object with data of Information input
 * @param {string} [params.pageName] - Name of page (eg Front)
 * @param {string} [params.formatedDate] - Date already formated
 * @returns {string} Paper name with PDF extension
 */
export const buildFilename = ({
  contacts,
  qualificationName,
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
  const safeFileName = qualificationName.replace(/\//g, '_')

  const filename = []
  let contactName = harmonizeContactsNames(contacts, t)

  filename.push(safeFileName)
  if (pageName) filename.push(pageName)
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
