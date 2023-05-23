/**
 * Check if a file is already selected in the state of the FormDataProvider
 * @param {object} formData - State of the FormDataProvider
 * @param {number} stepIndex - Used to know if the file is already selected for this step (Some paper have two Scan steps)
 * @param {File|Blob} currentFile - File or Blob object
 * @returns
 */
export const isFileAlreadySelected = (formData, stepIndex, currentFile) => {
  for (const data of formData.data) {
    if (data.stepIndex === stepIndex) {
      if (isSameFile(currentFile, data.file)) {
        return true
      }
    }
  }
  return false
}

/**
 * @param {File|Blob} currentFile - File or Blob object
 * @param {File|Blob} currentFile - File or Blob object
 * @returns {boolean}
 */
export const isSameFile = (currentFile, file) => {
  if (currentFile.constructor.name === 'Blob' && file.id === currentFile.id) {
    return true
  }
  if (
    currentFile.constructor.name === 'File' &&
    file.name === currentFile.name &&
    file.lastModified === currentFile.lastModified
  ) {
    return true
  }
  return false
}

/**
 * Clean a base64 string from its prefix (data:image/png;base64,)
 * @param {string} base64 - base64 string
 * @returns {string} base64 without prefix
 */
const cleanBase64 = base64 => {
  if (base64.startsWith('data:')) {
    const regex = /^data:[a-zA-Z0-9/+]+;base64,/
    return base64.replace(regex, '')
  }
  return base64
}

/**
 * Make a File object from a base64 string
 *
 * @param {Object} options
 * @param {string} options.base64 - base64 string
 * @param {string} options.name - file name
 * @param {string} options.type - file type
 * @returns {File}
 * @example
 * const file = makeFileFromBase64({ base64: 'iVBORw0KGgoAAAANSUhEUgAAAZAA', name: 'logo.png', type: 'image/png' })
 */
export const makeFileFromBase64 = ({ source, name, type } = {}) => {
  try {
    if (!source || !name || !type) {
      return null
    }

    const sourceWithoutPrefix = cleanBase64(source)

    const byteCharacters = atob(sourceWithoutPrefix)
    const sliceSize = 1024
    const totalBytes = byteCharacters.length
    const numSlices = Math.ceil(totalBytes / sliceSize)
    const byteArrays = new Array(numSlices)

    for (let sliceIndex = 0; sliceIndex < numSlices; sliceIndex++) {
      const startOffset = sliceIndex * sliceSize
      const endOffset = Math.min(startOffset + sliceSize, totalBytes)
      const slice = byteCharacters.slice(startOffset, endOffset)
      const byteNumbers = new Uint8Array(slice.length)

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      byteArrays[sliceIndex] = byteNumbers
    }

    const combinedByteArray = new Uint8Array(totalBytes)
    let offset = 0
    for (let i = 0; i < numSlices; i++) {
      const byteArray = byteArrays[i]
      combinedByteArray.set(byteArray, offset)
      offset += byteArray.length
    }

    const blob = new Blob(byteArrays, { type })
    const newFile = new File([blob], name, { type })

    return newFile
  } catch (error) {
    return null
  }
}
