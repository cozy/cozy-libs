import has from 'lodash/has'

/**
 * Indicates if the given konnector requires a folder to work properly.
 * This directly relies on the `fields.advancedFields.folderPath` from manifest.
 * @param  {Object} konnector
 * @return {bool}   `true` if the konnector needs a folder
 */
export const needsFolder = konnector =>
  has(konnector, 'fields.advancedFields.folderPath')

export default {
  needsFolder
}
