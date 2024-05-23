import * as addFileToPdf from 'cozy-ui/transpiled/react/ActionsMenu/Actions/helpers'

import * as buildFilename from './buildFilename'
import {
  addCountryValueByQualification,
  updateMetadata,
  createPdfAndSave
} from './createPdfAndSave'

jest.mock('cozy-client/dist/models/file', () => ({
  ...jest.requireActual('cozy-client/dist/models/file'),
  uploadFileWithConflictStrategy: jest.fn(() => ({
    data: { _id: '1234' }
  }))
}))

const mockPDFDocument = {
  getCreationDate: () => 'mockDate'
}

const mockParams = file => ({
  formData: {
    data: [
      {
        file,
        fileMetadata: {}
      }
    ],
    metadata: {},
    contacts: []
  },
  qualification: {},
  currentDefinition: {
    featureDate: '',
    label: `qualificationLabelTest-${file.type}`
  },
  appFolderID: '',
  client: {
    collection: jest.fn(() => ({
      addReferencedBy: jest.fn()
    }))
  },
  i18n: {
    t: jest.fn(),
    f: jest.fn(),
    scannerT: jest.fn()
  }
})

describe('createAndSavePdf', () => {
  jest.spyOn(addFileToPdf, 'addFileToPdf').mockReturnValue('')
  jest.spyOn(buildFilename, 'buildFilename').mockReturnValue('')

  it('should return array with fileId & theme label', async () => {
    const expectedPDF = [
      {
        fileId: '1234',
        qualificationLabel: 'qualificationLabelTest-application/pdf'
      }
    ]
    const expectedJPG = [
      { fileId: '1234', qualificationLabel: 'qualificationLabelTest-image/jpg' }
    ]

    const filePDF = new File(['bob'], 'bob.pdf', { type: 'application/pdf' })
    const fileJPG = new File(['bob'], 'bob.jpg', { type: 'image/jpg' })

    const resultPDF = await createPdfAndSave(mockParams(filePDF))
    const resultJPG = await createPdfAndSave(mockParams(fileJPG))

    expect(resultPDF).toEqual(expectedPDF)
    expect(resultJPG).toEqual(expectedJPG)
  })
})

describe('addCountryValueByQualification', () => {
  it('should return object with country key', () => {
    const qualification = { label: 'national_id_card' }
    const result = addCountryValueByQualification(qualification)
    expect(result).toEqual({ country: 'FR' })
  })

  it('should return empty object', () => {
    const qualification = { label: 'other_revenue' }
    const result = addCountryValueByQualification(qualification)
    expect(result).toEqual({})
  })
})

describe('updateMetadata', () => {
  it('should return metadata with other keys', () => {
    const result = updateMetadata({
      metadata: { name: 'name' },
      qualification: { label: 'national_id_card' },
      featureDate: 'referencedDate',
      pdfDoc: mockPDFDocument
    })

    expect(result).toEqual({
      name: 'name',
      qualification: { label: 'national_id_card' },
      datetime: 'mockDate',
      datetimeLabel: 'referencedDate',
      country: 'FR'
    })
  })
})
