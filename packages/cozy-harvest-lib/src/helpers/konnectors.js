import has from 'lodash/has'

/**
 * Indicates if the given konnector requires a folder to work properly.
 * This directly relies on the `fields.advancedFields.folderPath` from manifest.
 * @param  {Object} konnector
 * @return {bool}   `true` if the konnector needs a folder
 */
export const needsFolder = konnector =>
  has(konnector, 'fields.advancedFields.folderPath')

/**
 * Returns a permission ready to be passed to
 * client.collection('io.cozy.permissions').add().
 * @param  {Object} konnector The konnector to add permission to
 * @param  {Object} folder    The folder which the konnector should have access
 * @return {Object}           Permission object
 */
export const buildFolderPermission = folder => {
  return {
    // Legacy name
    saveFolder: {
      type: 'io.cozy.files',
      values: [folder._id],
      verbs: ['GET', 'PUT']
    }
  }
}

export default {
  needsFolder,
  buildFolderPermission
}
