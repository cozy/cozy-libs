import { generateWebLink } from 'cozy-client'
import {
  isEncrypted,
  isFromKonnector,
  normalize
} from 'cozy-client/dist/models/file'
import flag from 'cozy-flags'

/**
 * @typedef {object} Reference
 * @property {string} id - id of the document
 * @property {string} type - doctype of the document
 */

export const isFileEncrypted = file => isEncrypted(file)

export const formatDate = ({ f, lang, date }) => {
  if (lang === 'en') {
    return f(date, 'LL/dd/yyyy')
  }
  return f(date, 'dd/LL/yyyy')
}

export const isEditableAttribute = (name, file) => {
  const isNotEditableAttributes = ['datetime', 'qualification']

  return (
    !isNotEditableAttributes.includes(name) &&
    ((name === 'issueDate' && !isFromKonnector(file)) || name !== 'issueDate')
  )
}

export const normalizeAndSpreadAttributes = rawFile => {
  const normalizedFile = normalize(rawFile)

  return {
    ...normalizedFile,
    ...normalizedFile?.attributes
  }
}

/**
 * Return a web link to an application in the Cozy environment with the specified path
 * @param {object} param
 * @param {CozyClient} param.client - Instance of CozyClient
 * @param {string} param.slug - Slug of the application
 * @param {string} param.path - Path into the application
 * @returns {string} web link
 */
export const makeWebLink = ({ client, slug, path }) => {
  try {
    const cozyURL = new URL(client.getStackClient().uri)
    const { subdomain: subDomainType } = client.getInstanceOptions()

    return generateWebLink({
      pathname: '/',
      cozyUrl: cozyURL.origin,
      slug,
      hash: path,
      subDomainType
    })
  } catch (e) {
    return null
  }
}

/**
 * Remove the file name at the end of a path
 * @param {string} path
 * @returns {string} new path
 */
export const removeFilenameFromPath = path => {
  const newPath = path.substring(0, path.lastIndexOf('/'))
  return newPath === '' ? '/' : newPath
}

/**
 * Check if a file is compatible with AI summary feature
 * Compatible file types are defined in the drive.summary flag
 * Flag structure: [{ type: "mime/type", options: { ... } }, ...]
 * @param {object} file - File document with mime and metadata properties
 * @param {object} options - Optional parameters
 * @param {number} options.pdfPageCount - Number of pages if the file is a PDF
 * @returns {boolean} Whether the file is compatible with summary
 */
export const isFileSummaryCompatible = (
  file,
  options = { pdfPageCount: null }
) => {
  if (!file || !file.mime) {
    return false
  }

  const compatibleTypesRawValue = flag('drive.summary')
  const compatibleTypes = JSON.parse(compatibleTypesRawValue)
  if (!Array.isArray(compatibleTypes) || compatibleTypes.length === 0) {
    return false
  }

  const mime = file.mime.toLowerCase()

  for (const config of compatibleTypes) {
    if (!config || !config.type) {
      continue
    }

    const configType = config.type.toLowerCase()

    if (configType.endsWith('/*')) {
      const prefix = configType.slice(0, -2)
      if (!mime.startsWith(prefix + '/')) {
        continue
      }
    } else if (mime !== configType) {
      continue
    }

    if (config.options) {
      const { pageLimit } = config.options
      const { pdfPageCount } = options
      return pdfPageCount > 0 && pdfPageCount <= pageLimit
    }

    return true
  }

  return false
}
