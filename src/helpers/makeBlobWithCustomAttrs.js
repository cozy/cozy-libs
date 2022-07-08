/**
 * @param {Blob} blobFile
 * @param {object} attrs - Object with customs attributes
 * @returns {Blob}
 */
export const makeBlobWithCustomAttrs = (blobFile, attrs) => {
  const newBlob = new Blob([blobFile], { type: blobFile.type })

  for (const [key, value] of Object.entries(attrs)) {
    newBlob[key] = value
  }

  return newBlob
}
