import set from 'lodash/set'
import transform from 'lodash/transform'
import { PDFDocument } from 'pdf-lib'

import { models } from 'cozy-client'
import { addFileToPdf } from 'cozy-ui/transpiled/react/ActionsMenu/Actions/helpers'

import { CONTACTS_DOCTYPE, FILES_DOCTYPE } from '../doctypes'
import { buildFilename } from '../helpers/buildFilename'

const {
  file: { uploadFileWithConflictStrategy }
} = models

/**
 * @typedef {object} AddContactReferenceToFileParam
 * @property {IOCozyFile} fileCreated
 * @property {DocumentCollection} fileCollection
 * @property {object[]} contacts - Array of object of the contacts
 */

/**
 * @typedef {object} CreateAndSavePdfParam
 * @property {{ data: object[], metadata: object }} formData
 * @property {Qualification} qualification
 * @property {Paper} currentDefinition
 * @property {string} appFolderID
 * @property {CozyClient} client
 * @property {{t: Function, f: Function, scannerT: Function}} i18n
 */

/**
 * @param {{multipage: boolean, page: string}} fileMetadata
 * @param {boolean} isMultipage
 * @returns {object}
 */
const sanitizeFileMetadata = (fileMetadata, isMultipage) => {
  if (isMultipage || !fileMetadata.page) return {}

  // eslint-disable-next-line no-unused-vars
  const { multipage, ...newFileMetadata } = fileMetadata

  return newFileMetadata
}

/**
 * @param {AddContactReferenceToFileParam} param
 */
export const addContactReferenceToFile = async ({
  fileCreated,
  fileCollection,
  contacts
}) => {
  const references = contacts.map(contact => ({
    _id: contact._id,
    _type: CONTACTS_DOCTYPE
  }))
  await fileCollection.addReferencedBy(fileCreated, references)
}

/**
 * Convert image & pdf file to pdf & save it
 *
 * @param {CreateAndSavePdfParam} param
 * @returns {Promise<{ fileId: string, qualificationLabel: string }[]>} Return array of object with file id & qualification label to find its location
 */
export const createPdfAndSave = async ({
  formData,
  qualification,
  currentDefinition,
  appFolderID,
  client,
  i18n
}) => {
  const { t, f, scannerT } = i18n
  const { data, metadata, contacts } = { ...formData }
  const fileCollection = client.collection(FILES_DOCTYPE)
  const { featureDate, label, filenameModel } = currentDefinition

  const normalizedMetadata = transform(
    metadata,
    (result, value, key) => {
      set(result, key, value)
    },
    {}
  )

  const date =
    normalizedMetadata[featureDate] &&
    f(normalizedMetadata[featureDate], 'YYYY.MM.DD')

  // If all files are to be considered as one.
  const isMultiPage = data.some(({ fileMetadata }) => fileMetadata.multipage)

  // Created first document of PDFDocument
  let pdfDoc = await PDFDocument.create()

  let createdFilesList = []
  for (let idx = 0; idx < data.length; idx++) {
    const { file, fileMetadata } = data[idx]
    const pdfBytes = await addFileToPdf(pdfDoc, file)

    const paperName = buildFilename({
      filenameModel,
      metadata: normalizedMetadata,
      qualificationName: scannerT(`items.${label}`),
      pageName: fileMetadata.page
        ? t(`PapersList.label.${fileMetadata.page}`)
        : null,
      contacts,
      formatedDate: date,
      t
    })

    // Created metadata for pdf file
    const newMetadata = {
      qualification: {
        ...qualification
      },
      ...sanitizeFileMetadata(fileMetadata, isMultiPage),
      ...normalizedMetadata,
      datetime: normalizedMetadata[featureDate]
        ? normalizedMetadata[featureDate]
        : pdfDoc.getCreationDate(),
      datetimeLabel: normalizedMetadata[featureDate] ? featureDate : 'datetime'
    }

    // If isn't multipage or the last of multipage, save file
    if (!isMultiPage || (isMultiPage && idx === data.length - 1)) {
      const { data: fileCreated } = await uploadFileWithConflictStrategy(
        client,
        pdfBytes,
        {
          name: paperName,
          contentType: 'application/pdf',
          metadata: newMetadata,
          dirId: appFolderID,
          conflictStrategy: 'rename'
        }
      )
      await addContactReferenceToFile({ fileCreated, fileCollection, contacts })

      createdFilesList.push({
        fileId: fileCreated._id,
        qualificationLabel: label
      })
    }

    // If isn't multipage & not the last page, create new document of PDFDocument
    if (!isMultiPage && idx !== data.length - 1) {
      pdfDoc = await PDFDocument.create()
    }
  }
  return createdFilesList
}
