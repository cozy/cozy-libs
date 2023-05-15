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

let canvas
let canvasContext
export const makeRotatedImage = (image, rotation) => {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvasContext = canvas.getContext('2d')
  }
  if (!image || !canvasContext) return null

  const { width: imageWidth, height: imageHeight, currentSrc } = image
  const degree = rotation % 360

  if (!degree) {
    return { src: currentSrc }
  }

  const { PI, sin, cos, abs } = Math
  const angle = (degree * PI) / 180
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

  const src = canvas.toDataURL('image/png')
  canvas.width = 0
  canvas.height = 0

  return { src }
}
