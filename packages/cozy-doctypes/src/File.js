const trimEnd = require('lodash/trimEnd')

const Document = require('./Document')

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
}

CozyFile.doctype = 'io.cozy.files'

module.exports = CozyFile
