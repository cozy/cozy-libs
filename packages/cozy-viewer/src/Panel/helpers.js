import { splitFilename } from 'cozy-client/dist/models/file'

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
