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
}

CozyFile.doctype = 'io.cozy.files'

module.exports = CozyFile
