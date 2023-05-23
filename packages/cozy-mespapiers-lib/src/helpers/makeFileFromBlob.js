/**
 * @param {Blob} blobFile - Blob file
 * @param {Object} attrs - Custom attributes
 * @param {string} attrs.name - File name
 * @returns {File}
 */
export const makeFileFromBlob = (blobFile, { name } = {}) => {
  const defaultName = `${name || 'temp'}.${blobFile.type.split('/')[1]}`
  const newFile = new File([blobFile], defaultName, { type: blobFile.type })

  return newFile
}
