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
}

CozyFile.doctype = 'io.cozy.files'

module.exports = CozyFile
