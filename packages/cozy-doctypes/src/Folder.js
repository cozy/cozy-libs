const Application = require('./Application')
const CozyFile = require('./File')

/**
 * Class representing the folder model.
 * @extends CozyFile
 */
class CozyFolder extends CozyFile {
  /**
   * Create a folder with a reference to the given document
   * @param  {String}  path     Folder path
   * @param  {Object}  document Document to make reference to. Any doctype.
   * @return {Object}  Folder document
   */
  static async createFolderWithReference(path, document) {
    const collection = this.cozyClient.collection(CozyFile.doctype)
    const dirId = await collection.ensureDirectoryExists(path)
    await collection.addReferencesTo(document, [
      {
        _id: dirId
      }
    ])

    const { data: dirInfos } = await collection.get(dirId)

    return dirInfos
  }

  /**
   * Returns a "Magic Folder", given its id
   * @param  {String} id Magic Folder id. `CozyFolder.magicFolders` contains the
   * ids of folders that can be magic folders.
   * @param {String} path Default path to use if magic folder does not exist
   * @return {Object} Folder document
   */
  static async ensureMagicFolder(id, path) {
    const magicFolderDocument = {
      _type: Application.doctype,
      _id: id
    }
    const folders = await this.getReferencedFolders(magicFolderDocument)
    const existingMagicFolder = folders.length ? folders[0] : null

    if (existingMagicFolder) return existingMagicFolder

    const magicFoldersValues = Object.values(this.magicFolders)
    if (!magicFoldersValues.includes(id)) {
      throw new Error(
        `Cannot create Magic folder with id ${id}. Allowed values are ${magicFoldersValues.join(
          ', '
        )}.`
      )
    }

    if (!path) {
      throw new Error('Magic folder default path must be defined')
    }

    return this.createFolderWithReference(path, magicFolderDocument)
  }

  /**
   * Returns an array of folder referenced by the given document
   * @param  {Object}  document  Document to get references from
   * @return {Array}             Array of folders referenced with the given
   * document
   */
  static async getReferencedFolders(document) {
    const { included } = await this.cozyClient
      .collection(CozyFile.doctype)
      .findReferencedBy(document)
    return included.filter(folder => !this.isTrashed(folder))
  }

  /**
   * Returns an unique folder referenced with the given reference. Creates it
   * if it does not exist.
   * @param  {String}  path      Path used to create folder if the referenced
   * folder does not exist.
   * @param  {Object}  document  Document to create references from
   * @return {Objet}             Folder referenced with the give reference
   */
  static async ensureFolderWithReference(path, document) {
    const existingFolders = await this.getReferencedFolders(document)
    if (existingFolders.length) return existingFolders[0]

    const collection = this.cozyClient.collection(CozyFile.doctype)
    const dirId = await collection.ensureDirectoryExists(path)
    await collection.addReferencesTo(document, [
      {
        _id: dirId
      }
    ])

    const { data: dirInfos } = await collection.get(dirId)

    return dirInfos
  }

  /**
   * Indicates if a folder is in trash
   * @param  {Object}  folder `io.cozy.files` document
   * @return {Boolean}        `true` if the folder is in trash, `false`
   * otherwise.
   */
  static isTrashed(folder) {
    return /^\/\.cozy_trash/.test(folder.attributes.path)
  }
}

/**
 * References used by the Cozy platform and apps for specific folders.
 */
CozyFolder.magicFolders = {
  ADMINISTRATIVE: `${Application.doctype}/administrative`,
  PHOTOS: `${Application.doctype}/photos`,
  PHOTOS_BACKUP: `${Application.doctype}/photos/mobile`,
  PHOTOS_UPLOAD: `${Application.doctype}/photos/upload`,
  NOTES_FOLDER: `${Application.doctype}/notes`
}

module.exports = CozyFolder
