/**
 * @param {HTMLImageElement} image
 * @param {number} [maxSizeInPixel=900] - Max size in pixel
 * @returns {number}
 */
export const getImageScaleRatio = (image, maxSize = 900) => {
  const longerSideSizeInPixel = Math.max(image.height, image.width)
  let scaleRatio = 1
  if (maxSize < longerSideSizeInPixel) {
    scaleRatio = maxSize / longerSideSizeInPixel
  }

  return scaleRatio
}

/**
 * @param {string} fileDataUri
 * @param {string} fileType
 * @returns {Promise<string>}
 */
export const resizeImage = async (fileDataUri, fileType) => {
  return new Promise((resolve, reject) => {
    const newImage = new Image()
    newImage.src = fileDataUri
    newImage.onerror = reject
    newImage.onload = () => {
      const canvas = document.createElement('canvas')
      const scaleRatio = getImageScaleRatio(newImage)
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
