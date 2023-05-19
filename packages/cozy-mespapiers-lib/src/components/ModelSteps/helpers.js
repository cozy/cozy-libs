/**
 * Check if a file is already selected in the state of the FormDataProvider
 * @param {object} formData - State of the FormDataProvider
 * @param {number} stepIndex - Used to know if the file is already selected for this step (Some paper have two Scan steps)
 * @param {File} currentFile - File object
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
 * @param {File} currentFile - File object
 * @param {File} file - File object
 * @returns {boolean}
 */
export const isSameFile = (currentFile, file) => {
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

let canvas
let canvasContext
/**
 * @param {HTMLImageElement} image - Image element
 * @param {number} rotation - Rotation in degrees
 * @returns {string} - Base64 string
 */
export const makeRotatedImage = (image, rotation) => {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvasContext = canvas.getContext('2d')
  }
  if (!image || !canvasContext) return null

  const { width: imageWidth, height: imageHeight } = image

  if (rotation === 0) return image.src

  const { PI, sin, cos, abs } = Math
  const angle = (rotation * PI) / 180
  const sinAngle = sin(angle)
  const cosAngle = cos(angle)

  canvas.width = abs(imageWidth * cosAngle) + abs(imageHeight * sinAngle)
  canvas.height = abs(imageWidth * sinAngle) + abs(imageHeight * cosAngle)

  // The width and height of the canvas will be automatically rounded
  const { width: canvasWidth, height: canvasHeight } = canvas

  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
  canvasContext.translate(canvasWidth / 2, canvasHeight / 2)
  canvasContext.rotate(angle)

  canvasContext.drawImage(
    image,
    -imageWidth / 2,
    -imageHeight / 2,
    imageWidth,
    imageHeight
  )

  /**
   * A Number between 0 and 1 indicating the image quality to be used when creating images using file formats that support lossy compression (such as image/jpeg or image/webp).
   * see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   */
  const encoderOptions = 0.6

  const src = canvas.toDataURL('image/webp', encoderOptions)
  canvas.width = 0
  canvas.height = 0

  return src
}

/**
 * @param {Object} options
 * @param {Array} options.formData - State of the FormDataProvider
 * @param {number} options.stepIndex - Used to know if the file is already selected for this step (Some paper have two Scan steps)
 * @returns {File} - Last file selected for this step
 */
export const getLastFormDataFile = ({ formData, stepIndex }) => {
  const data = formData.data.filter(data => data.stepIndex === stepIndex)
  const { file } = data[data.length - 1] || {}

  return file || null
}
