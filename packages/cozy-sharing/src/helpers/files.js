/**
 * Fetches the file paths for the given files.
 * Should not be used for directories.
 *
 * @param {Object} client - The cozy-client instance.
 * @param {string} doctype - The type of document.
 * @param {Array} files - The array of files.
 * @returns {Promise<Array>} - The array of file paths.
 */
export const fetchFilesPaths = async (client, doctype, files) => {
  const parentDirIds = files
    .map(f => f.dir_id)
    .filter((f, idx, arr) => arr.indexOf(f) === idx)
  const parentDirs = await client
    .collection(doctype)
    .all({ keys: parentDirIds })
  const filePaths = files
    .map(f => parentDirs.data.find(d => d.id === f.dir_id))
    .filter(parentDir => parentDir !== undefined)
    .map(parentDir => {
      const parentDirPath = parentDir.path
      return parentDirPath === '/'
        ? `/${parentDir.name}`
        : `${parentDirPath}/${parentDir.name}`
    })
  return filePaths
}
