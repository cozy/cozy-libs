import parse from 'date-fns/parse'

import { isAndroid, isIOS } from 'cozy-device-helper'
import log from 'cozy-logger'
import { knownDateMetadataNames } from 'cozy-ui/transpiled/react/Viewer/helpers'

import { ANDROID_APP_URL, IOS_APP_URL } from '../../constants/const'
import { findAttributes } from '../../helpers/findAttributes'

/**
 * Check if a file is already selected in the state of the FormDataProvider
 * @param {object} formData - State of the FormDataProvider
 * @param {number} currentStepIndex - Used to know if the file is already selected for this step (Some paper have two Scan steps)
 * @param {File} currentFile - File object
 * @returns
 */
export const isFileAlreadySelected = (
  formData,
  currentStepIndex,
  currentFile
) => {
  for (const data of formData.data) {
    if (data.stepIndex === currentStepIndex) {
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

/**
 * Make a base64 string from a File object
 * @param {File} file - File object
 * @param {Object} [options]
 * @param {boolean} [options.prefix] - If true, add prefix to base64 string (data:image/png;base64,) (default: true)
 * @returns {Promise<string | null>} base64 string
 */
export const makeBase64FromFile = async (file, { prefix = true } = {}) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const base64 = prefix ? reader.result : cleanBase64(reader.result)
      resolve(base64)
    }
    reader.onerror = err => {
      reject(err)
    }
  })
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
 * @param {number} options.currentStepIndex - Used to know if the file is already selected for this step (Some paper have two Scan steps)
 * @returns {File} - Last file selected for this step
 */
export const getLastFormDataFile = ({ formData, currentStepIndex }) => {
  const data = formData.data.filter(data => data.stepIndex === currentStepIndex)
  const { file } = data[data.length - 1] || {}

  return file || null
}

export const getLink = () => {
  if (isIOS()) {
    return { url: IOS_APP_URL, name: 'ios' }
  }
  if (isAndroid()) {
    return { url: ANDROID_APP_URL, name: 'android' }
  }
  // Case that should only exist in development, as this component is used in ScanMobileActions
  return { url: IOS_APP_URL, name: 'ios' }
}

/**
 * @typedef {Object} FileToHandle
 * @property {string} name - The name of the file.
 * @property {string} source - The base64 encoded content of the file.
 * @property {string} type - The MIME type of the file.
 */

/**
 * Validates the structure of a file object received from native.
 * Ensures that the file has the required properties: type, name, and source.
 *
 * @param {FileToHandle} file - The file object to validate.
 * @throws {Error} If the file object is missing any of the required properties.
 */
export const validateFileFromNative = file => {
  if (!file.type || !file.name || !file.source) {
    throw new Error('Incomplete file received from native')
  }
}

/**
 * Fetches the files from native via the given `webviewIntent` and returns the first valid file.
 *
 * This function is used to retrieve files from native to the webview context.
 * It ensures that the file contains all required fields such as type, name, and source.
 *
 * @param {Object} webviewIntent - The webview intent service to interact with the native environment.
 * @param {function} webviewIntent.call - A function to call native methods, expecting the method name and its arguments.
 *
 * @throws {Error} Throws an error if no valid files are received from native or if the file structure is invalid.
 *
 * @return {Promise<FileToHandle>} The first valid file object containing the required fields.
 *
 * @example
 * const validFile = await getFirstFileFromNative(webviewInterface);
 */
export const getFirstFileFromNative = async webviewIntent => {
  // The second argument is true to indicate that we want to receive the file source as a base64 string.
  const files = await webviewIntent.call('getFilesToHandle', true)

  if (!files) throw new Error('Empty response from getFilesToHandle')

  if (files.length === 0)
    throw new Error('Empty array received from getFilesToHandle')

  const fileToHandle = files[0]

  validateFileFromNative(fileToHandle)

  return fileToHandle
}

const _getAttributesFromOcr = async ({
  file,
  ocrAttributes,
  webviewIntent
}) => {
  const cleanB64FrontFile = await makeBase64FromFile(file, {
    prefix: false
  })
  const ocrFromFlagshipResult = await webviewIntent.call(
    'ocr',
    cleanB64FrontFile
  )
  const { attributes: attributesFound } = findAttributes(
    ocrFromFlagshipResult.OCRResult,
    ocrFromFlagshipResult.imgSize,
    ocrAttributes
  )
  return attributesFound
}

/**
 * Get formData files for OCR
 * @param {Object} formData - State of the FormDataProvider
 * @param {File} lastFileRotated - File object
 * @returns {File[]} - Files to send to OCR
 */
export const getFormDataFilesForOcr = (formData, lastFileRotated) => {
  return formData.data.length > 1
    ? [
        formData.data.find(data => data.fileMetadata.page === 'front')?.file,
        lastFileRotated ||
          formData.data.find(data => data.fileMetadata.page === 'back')?.file
      ].filter(Boolean)
    : [lastFileRotated || formData.data[0]?.file].filter(Boolean)
}

/**
 * Get attributes from OCR
 * @param {Object} options
 * @param {Object} options.formData - State of the FormDataProvider
 * @param {Object} options.ocrAttributes - OCR attributes config of current definition of paper
 * @param {File} options.currentFile - File object
 * @param {File} options.currentFileRotated - File object
 * @param {Object} options.webviewIntent - Webview intent
 * @returns {Promise<Object[]>} - Attributes found
 */
export const getAttributesFromOcr = async ({
  files,
  ocrAttributes,
  webviewIntent
}) => {
  try {
    const isDoubleSidedFile = files.length > 1

    if (isDoubleSidedFile) {
      const attributesFrontFound = await _getAttributesFromOcr({
        file: files[0],
        ocrAttributes: ocrAttributes.front,
        webviewIntent
      })
      const attributesBackFound = await _getAttributesFromOcr({
        file: files[1],
        ocrAttributes: ocrAttributes.back,
        webviewIntent
      })
      return attributesFrontFound.concat(attributesBackFound)
    }

    const attributesFound = await _getAttributesFromOcr({
      file: files[0],
      ocrAttributes: ocrAttributes.front,
      webviewIntent
    })
    return attributesFound
  } catch (error) {
    log(
      'error',
      `Error while getting attributes from OCR: ${error}`,
      'getAttributesFromOcr'
    )
    return []
  }
}

/**
 * Get date from string
 * @param {string} string - String to parse
 * @returns {string} - Date in ISO format
 */
const getDatefromString = string => {
  try {
    const [day, month, year] = string.split(/[ .-]/)
    const dateFormat = 'ddMMyyyy'
    const date = parse(`${day}${month}${year}`, dateFormat, new Date())
    return date.toISOString()
  } catch (error) {
    log('info', `Error while parsing date: ${error}`, 'getDatefromString')
    return string
  }
}

/**
 * Make metadata from OCR attributes
 * @param {Object[]} ocrAttributes - Attributes found from OCR
 * @returns {Object} - Metadata
 */
export const makeMetadataFromOcr = ocrAttributes => {
  return ocrAttributes.reduce((acc, { name, value }) => {
    return {
      ...acc,
      [name]: knownDateMetadataNames.includes(name)
        ? getDatefromString(value)
        : value
    }
  }, {})
}
