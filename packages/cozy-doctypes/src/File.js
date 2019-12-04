const trimEnd = require('lodash/trimEnd')
const Document = require('./Document')

const FILENAME_WITH_EXTENSION_REGEX = /(.+)(\..*)$/

/**
 * Class representing the file model.
 * @extends Document
 */
class CozyFile extends Document {
  /**
   * async getFullpath - Gets a file's path
   *
   * @param  {string} dirID  The id of the parent directory
   * @param  {string} name   The file's name
   * @return {string}        The full path of the file in the cozy
   **/
  static async getFullpath(dirId, name) {
    if (!dirId) {
      throw new Error('You must provide a dirId')
    }

    const parentDir = await this.get(dirId)
    const parentDirectoryPath = trimEnd(parentDir.path, '/')
    return `${parentDirectoryPath}/${name}`
  }

  /**
   * Move file to destination.
   *
   * @param   {string} fileId               - The file's id (required)
   * @param   {object} destination
   * @param   {string} destination.folderId - The destination folder's id (required)
   * @param   {string} destination.path     - The file's path after the move (optional, used to optimize performance in case of conflict)
   * @param   {string} force                - Whether we should overwrite the destination in case of conflict (defaults to false)
   * @returns {Promise}                     - A promise that returns the move action response and the deleted file id (if any) if resolved or an Error if rejected
   *
   */
  static async move(fileId, destination, force = false) {
    const { folderId, path } = destination
    const filesCollection = this.cozyClient.collection('io.cozy.files')
    try {
      const resp = await filesCollection.updateFileMetadata(fileId, {
        dir_id: folderId
      })

      return {
        moved: resp.data,
        deleted: null
      }
    } catch (e) {
      if (e.status === 409 && force) {
        let destinationPath
        if (path) {
          destinationPath = path
        } else {
          const movedFile = await this.get(fileId)
          const filename = movedFile.name
          destinationPath = await this.getFullpath(folderId, filename)
        }
        const conflictResp = await filesCollection.statByPath(destinationPath)
        await filesCollection.destroy(conflictResp.data)
        const resp = await filesCollection.updateFileMetadata(fileId, {
          dir_id: folderId
        })

        return {
          moved: resp.data,
          deleted: conflictResp.data.id
        }
      } else {
        throw e
      }
    }
  }
  /**
   * Method to split both the filename and the extension
   *
   * @param {Object} file An io.cozy.files
   * @return {Object}  return an object with {filename: , extension: }
   */
  static splitFilename(file) {
    if (!file.name) throw new Error('file should have a name property ')

    if (file.type === 'file') {
      const match = file.name.match(FILENAME_WITH_EXTENSION_REGEX)
      if (match) {
        return { filename: match[1], extension: match[2] }
      }
    }
    return { filename: file.name, extension: '' }
  }
  /**
   *
   * Method to upload a file even if a file with the same name already exists.
   *
   * @param {String} path Fullpath for the file ex: path/to/
   * @param {Object} file HTML Object file
   * @param {Object} metadata An object containing the wanted metadata to attach
   */
  static async overrideFileForPath(path, file, metadata) {
    if (!path.endsWith('/')) path = path + '/'

    const filesCollection = this.cozyClient.collection('io.cozy.files')
    try {
      const existingFile = await filesCollection.statByPath(path + file.name)

      const { id: fileId, dir_id: dirId } = existingFile.data
      const resp = await filesCollection.updateFile(file, {
        dirId,
        fileId,
        metadata
      })
      return resp
    } catch (error) {
      if (/Not Found/.test(error)) {
        const dirId = await filesCollection.ensureDirectoryExists(path)
        const createdFile = await filesCollection.createFile(file, {
          dirId,
          metadata
        })
        return createdFile
      }
      throw error
    }
  }
  /**
   * Method to generate a new filename if there is a conflict
   *
   * @param {String} filenameWithoutExtension A filename without the extension
   * @return {String} A filename with the right suffix
   */
  static generateNewFileNameOnConflict(filenameWithoutExtension) {
    //Check if the string ends by _1
    const regex = new RegExp('(_)([0-9]+)$')
    const matches = filenameWithoutExtension.match(regex)
    if (matches) {
      let versionNumber = parseInt(matches[2])
      //increment versionNumber
      versionNumber++
      const newFilenameWithoutExtension = filenameWithoutExtension.replace(
        new RegExp('(_)([0-9]+)$'),
        `_${versionNumber}`
      )
      return newFilenameWithoutExtension
    } else {
      return `${filenameWithoutExtension}_1`
    }
  }

  static generateFileNameForRevision(file, revision, f) {
    const { filename, extension } = CozyFile.splitFilename({
      name: file.name,
      type: 'file'
    })
    return `${filename}_${f(
      revision.updated_at,
      'DD MMMM - HH[h]mm'
    )}${extension}`
  }
  /**
   * The goal of this method is to upload a file based on a conflict strategy.
   * Be careful: We need to check if the file exists by doing a statByPath query
   * before trying to upload the file since if we post and the stack return a
   * 409 conflict, we will get a SPDY_ERROR_PROTOCOL on Chrome. This is the only
   * viable workaround
   * If there is no conflict, then we upload the file.
   * If there is a conflict, then we apply the conflict strategy : `erase` or `rename`
   * @param {String} name File Name
   * @param {ArrayBuffer} file data
   * @param {String} dirId dir id where to upload
   * @param {String} conflictStrategy Actually only 2 hardcoded strategies 'erase' or 'rename'
   * @param {Object} metadata An object containing the metadata to attach
   * @param {String} contentType content type of the file
   */
  static async uploadFileWithConflictStrategy(
    name,
    file,
    dirId,
    conflictStrategy,
    metadata,
    contentType
  ) {
    const filesCollection = this.cozyClient.collection('io.cozy.files')

    try {
      const path = await CozyFile.getFullpath(dirId, name)

      const existingFile = await filesCollection.statByPath(path)
      const { id: fileId } = existingFile.data
      if (conflictStrategy === 'erase') {
        //!TODO Bug Fix. Seems we have to pass a name attribute ?!
        const resp = await filesCollection.updateFile(file, {
          dirId,
          fileId,
          name,
          metadata,
          contentType
        })
        return resp
      } else {
        const { filename, extension } = CozyFile.splitFilename({
          name,
          type: 'file'
        })
        const newFileName =
          CozyFile.generateNewFileNameOnConflict(filename) + extension
        //recall itself with the newFilename.
        return CozyFile.uploadFileWithConflictStrategy(
          newFileName,
          file,
          dirId,
          conflictStrategy,
          metadata,
          contentType
        )
      }
    } catch (error) {
      if (/Not Found/.test(error.message)) {
        return await CozyFile.upload(name, file, dirId, metadata, contentType)
      }
      throw error
    }
  }
  /**
   *
   * @param {String} name File's name
   * @param {ArrayBuffer} file
   * @param {String} dirId
   * @param {Object} metadata
   * @param {String} contentType
   */
  static async upload(name, file, dirId, metadata, contentType = 'image/jpeg') {
    return this.cozyClient.collection('io.cozy.files').createFile(file, {
      name,
      dirId,
      contentType,
      lastModifiedDate: new Date(),
      metadata
    })
  }
}

CozyFile.doctype = 'io.cozy.files'

module.exports = CozyFile
