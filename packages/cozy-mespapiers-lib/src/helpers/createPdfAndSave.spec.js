import * as addFileToPdf from 'src/utils/addFileToPdf'
import * as buildFilename from 'src/helpers/buildFilename'
import { createPdfAndSave } from 'src/helpers/createPdfAndSave'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  models: {
    contact: {
      getFullname: jest.fn()
    },
    file: {
      uploadFileWithConflictStrategy: jest.fn(() => ({
        data: { _id: '1234' }
      }))
    }
  }
}))

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
  currentDefinition: { featureDate: '', label: `themeLabeTest-${file.type}` },
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
      { fileId: '1234', themeLabel: 'themeLabeTest-application/pdf' }
    ]
    const expectedJPG = [
      { fileId: '1234', themeLabel: 'themeLabeTest-image/jpg' }
    ]

    const filePDF = new File(['bob'], 'bob.pdf', { type: 'application/pdf' })
    const fileJPG = new File(['bob'], 'bob.jpg', { type: 'image/jpg' })

    const resultPDF = await createPdfAndSave(mockParams(filePDF))
    const resultJPG = await createPdfAndSave(mockParams(fileJPG))

    expect(resultPDF).toEqual(expectedPDF)
    expect(resultJPG).toEqual(expectedJPG)
  })
})
