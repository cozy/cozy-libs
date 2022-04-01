/**
 * @typedef {object} BuildPaperNameParam
 * @property {string} qualificationName - Name of the paper qualification
 * @property {Array<string>} [filenameModel] - Array of key for build filename
 * @property {object} [metadata] - Object with data of Information input
 * @property {string} [pageName] - Name of page (eg Front)
 * @property {string} [contactName] - Fullname of contact
 * @property {string} [formatedDate] - Date already formated
 */

/**
 * Builded Paper name with qualification name & without use filename original
 * @param {BuildPaperNameParam} opts
 * @returns {string} Paper name with PDF extension
 */
export const buildFilename = ({ metadata, filenameModel, ...opts }) => {
  /*
    Calling the stack's file creation method would trigger a `status: "422", title: "Invalid Parameter"` error if filename contains`/`.
    So we need to remove any occurrence of this character from the filename.
  */
  const safeFileName = opts.qualificationName.replaceAll('/', '_')

  const pageName = opts.pageName ? ` - ${opts.pageName}` : ''
  const contactName = opts.contactName ? ` - ${opts.contactName}` : ''
  const formatedDate = opts.formatedDate ? ` - ${opts.formatedDate}` : ''

  if (filenameModel?.length > 0) {
    const result = filenameModel
      .map(el => {
        if (el === 'label') return safeFileName
        if (el === 'contactName') return opts.contactName || ''
        if (el === 'featureDate') return opts.formatedDate || ''
        return metadata?.[el] ? metadata[el] : null
      })
      .filter(Boolean)

    if (result.length > 0) {
      return `${result.join(' - ')}.pdf`
    }
  }

  return `${safeFileName}${pageName}${contactName}${formatedDate}.pdf`
}
