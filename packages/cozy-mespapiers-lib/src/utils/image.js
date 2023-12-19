/**
 * @param {HTMLImageElement} image
 * @param {number} [maxSizeInPixel] - Maximum size before being resized
 * @returns {number}
 */
export const getImageScaleRatio = (image, maxSize) => {
  const longerSideSizeInPixel = Math.max(image.height, image.width)
  let scaleRatio = 1
  if (maxSize < longerSideSizeInPixel) {
    scaleRatio = maxSize / longerSideSizeInPixel
  }

  return scaleRatio
}

/**
 * @param {object} opts
 * @param {string} opts.base64 - Base64 of image
 * @param {string} opts.type - Type of image
 * @param {number} opts.maxSize - Maximum size before being resized
 * @returns {Promise<string>}
 */
export const resizeImage = async ({
  base64: fileDataUri,
  type: fileType,
  maxSize
}) => {
  return new Promise((resolve, reject) => {
    const newImage = new Image()
    newImage.src = fileDataUri
    newImage.onerror = reject
    newImage.onload = () => {
      const canvas = document.createElement('canvas')
      const scaleRatio = getImageScaleRatio(newImage, maxSize)
      const scaledWidth = scaleRatio * newImage.width
      const scaledHeight = scaleRatio * newImage.height

      canvas.width = scaledWidth
      canvas.height = scaledHeight
      canvas
        .getContext('2d')
        .drawImage(newImage, 0, 0, scaledWidth, scaledHeight)

      resolve(canvas.toDataURL(fileType))
    }
  })
}

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export const fileToDataUri = async file => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onerror = reject
    reader.onload = e => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}
