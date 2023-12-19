import { PDFDocument } from 'pdf-lib'

import { resizeImage, fileToDataUri } from '../utils/image'
import { fileToArrayBuffer } from '../utils/pdf'

// Should guarantee good resolution for different uses (printing, downloading, etc.)
const MAX_RESIZE_IMAGE_SIZE = 3840

/**
 * @param {PDFDocument} pdfDoc
 * @param {File} file
 * @returns {Promise<void>}
 */
const addImageToPdf = async (pdfDoc, file) => {
  const fileDataUri = await fileToDataUri(file)
  const resizedImage = await resizeImage({
    base64: fileDataUri,
    type: file.type,
    maxSize: MAX_RESIZE_IMAGE_SIZE
  })

  let img
  if (file.type === 'image/png') img = await pdfDoc.embedPng(resizedImage)
  if (file.type === 'image/jpeg') img = await pdfDoc.embedJpg(resizedImage)

  const page = pdfDoc.addPage([img.width, img.height])
  const { width: pageWidth, height: pageHeight } = page.getSize()
  page.drawImage(img, {
    x: pageWidth / 2 - img.width / 2,
    y: pageHeight / 2 - img.height / 2,
    width: img.width,
    height: img.height
  })
}

/**
 * @param {PDFDocument} pdfDoc
 * @param {File} file
 * @returns {Promise<void>}
 */
const addPdfToPdf = async (pdfDoc, file) => {
  const pdfToAdd = await fileToArrayBuffer(file)
  const document = await PDFDocument.load(pdfToAdd)
  const copiedPages = await pdfDoc.copyPages(
    document,
    document.getPageIndices()
  )
  copiedPages.forEach(page => pdfDoc.addPage(page))
}

/**
 * @param {PDFDocument} pdfDoc - Instance of PDFDocument
 * @param {File} file - File to add in pdf
 * @returns {Promise<ArrayBuffer>} - Data of pdf generated
 */
export const addFileToPdf = async (pdfDoc, file) => {
  if (file.type === 'application/pdf') {
    await addPdfToPdf(pdfDoc, file)
  } else {
    await addImageToPdf(pdfDoc, file)
  }
  const pdfDocBytes = await pdfDoc.save()

  return pdfDocBytes
}
