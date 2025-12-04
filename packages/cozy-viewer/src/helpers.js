import { generateWebLink } from 'cozy-client'
import {
  isEncrypted,
  isFromKonnector,
  normalize
} from 'cozy-client/dist/models/file'
import flag from 'cozy-flags'
import logger from 'cozy-logger'

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
 * Estimate the number of tokens in a text
 * Assuming 1 token ~ 4 characters
 * @param {string} text - Text to estimate tokens for
 * @returns {number} Estimated number of tokens
 */
export const roughTokensEstimation = text => {
  return Math.ceil(text.length / 4)
}

/**
 * Get and parse the drive.summary flag configuration
 * @returns {object|null} Parsed summary config or null if not available/invalid
 */
export const getSummaryConfig = () => {
  const summaryConfigRawValue = flag('drive.summary')
  if (!summaryConfigRawValue) {
    return null
  }

  try {
    return JSON.parse(summaryConfigRawValue)
  } catch (e) {
    logger.error('Failed to parse drive.summary flag:', e)
    return null
  }
}

/**
 * Check if a file is compatible with AI summary feature
 * Compatible file types are defined in the drive.summary flag
 * Flag structure: { types: ["mime/type", ...], pageLimit: number }
 * @param {object} file - File document with mime and metadata properties
 * @param {object} options - Optional parameters
 * @param {number} options.pageCount - Number of pages in the file (for PDFs, text files, etc.)
 * @returns {boolean} Whether the file is compatible with summary
 */
export const isFileSummaryCompatible = (
  file,
  options = { pageCount: null }
) => {
  if (!file || !file.mime) {
    return false
  }

  const summaryConfig = getSummaryConfig()
  if (!summaryConfig) {
    return false
  }

  if (
    !summaryConfig ||
    !Array.isArray(summaryConfig.types) ||
    summaryConfig.types.length === 0
  ) {
    return false
  }

  const mime = file.mime.toLowerCase()
  const isCompatibleType = summaryConfig.types.some(type => {
    const configType = type.toLowerCase()

    if (configType.endsWith('/*')) {
      const prefix = configType.slice(0, -2)
      return mime.startsWith(prefix + '/')
    }

    return mime === configType
  })

  if (!isCompatibleType) {
    return false
  }

  if (
    summaryConfig.pageLimit &&
    options.pageCount !== null &&
    options.pageCount !== undefined
  ) {
    return options.pageCount > 0 && options.pageCount <= summaryConfig.pageLimit
  }

  return true
}
