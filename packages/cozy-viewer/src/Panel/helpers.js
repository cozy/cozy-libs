import { splitFilename } from 'cozy-client/dist/models/file'
import {
  formatMetadataQualification,
  KNOWN_BILLS_ATTRIBUTES_NAMES
} from 'cozy-client/dist/models/paper'

/**
 * Returns file extension or class
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @returns {string}
 */
export const makeFormat = file => {
  const { extension } = splitFilename(file)
  return (extension.replace('.', '') || file.class).toUpperCase()
}

/**
 * Returns a formatted date
 * @param {string} lang - language in ISO 639-1 format
 * @returns {string}
 */
export const makeDate = lang =>
  lang === 'fr' ? 'DD MMM YYYY à HH:mm' : 'MMM DD YYYY at HH:mm'

/**
 * Returns a formatted size
 * @param {number} bytes - file bytes
 * @returns {string}
 */
export const makeSize = bytes => {
  if (!+bytes) return '0'

  const k = 1024
  const dm = 2
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Returns file path
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @returns {string}
 */
export const makePath = file => file.path?.replace(`/${file.name}`, '')

/**
 *
 * @param {array} formattedMetadataQualification
 * @param {number} idx
 * @returns {boolean}
 */
export const makeHideDivider = (formattedMetadataQualification, idx) => {
  const lastItem = formattedMetadataQualification.at(-1)
  const isLastItem = idx === formattedMetadataQualification.length - 1
  const isSecondLastItem = idx === formattedMetadataQualification.length - 2
  const hideDivider =
    isLastItem || (isSecondLastItem && lastItem.name === 'contact')

  return hideDivider
}

/**
 *
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @param {Object} metadata - An io.cozy.files metadata object
 * @returns {array}
 */
export const makeFormattedMetadataQualification = (file, metadata) => {
  const relatedBills = file.bills?.data?.[0]
  const formattedMetadataQualification = formatMetadataQualification(
    metadata
  ).sort((a, b) =>
    a.name === 'qualification' ? -1 : b.name === 'qualification' ? 1 : 0
  ) // move "qualification" metadata in first position

  if (relatedBills) {
    const formattedBillsMetadata = KNOWN_BILLS_ATTRIBUTES_NAMES.map(
      attrName => ({ name: attrName, value: relatedBills[attrName] })
    )

    return formattedMetadataQualification.concat(formattedBillsMetadata)
  }

  return formattedMetadataQualification
}
