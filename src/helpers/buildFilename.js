import { harmonizeContactsNames } from '../components/Papers/helpers'

/**
 * Builded Paper name with qualification name & without use filename original
 * @param {string} contacts - Array of contacts
 * @param {string} qualificationName - Name of the paper qualification
 * @param {Array<string>} [filenameModel] - Array of key for build filename
 * @param {object} [metadata] - Object with data of Information input
 * @param {string} [pageName] - Name of page (eg Front)
 * @param {string} [formatedDate] - Date already formated
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
  const safeFileName = qualificationName.replaceAll('/', '_')

  const filename = []
  let contactName = harmonizeContactsNames(contacts, t)

  filename.push(safeFileName)
  if (pageName) filename.push(pageName)
  if (contactName) filename.push(contactName)
  if (formatedDate) filename.push(formatedDate)

  if (filenameModel?.length > 0) {
    const filenameWithModel = filenameModel
      .map(el => {
        if (el === 'label') return safeFileName
        if (el === 'contactName') return contactName || ''
        if (el === 'featureDate') return formatedDate || ''
        return metadata?.[el] ? metadata[el] : null
      })
      .filter(Boolean)

    if (filenameWithModel.length > 0) {
      return `${filenameWithModel.join(' - ')}.pdf`
    }
  }

  if (filename.length > 1) {
    return `${filename.join(' - ')}.pdf`
  }

  return `${filename.join()}.pdf`
}
