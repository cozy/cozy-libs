import {
  isInformationEditPermitted,
  updateFileMetadata,
  makeCurrentStep,
  updateReferencedContact,
  getPaperDefinitionByFile
} from './helpers'
import { mockPapersDefinitions } from '../../../../test/mockPaperDefinitions'

const informationStep = {
  model: 'information',
  illustration: 'IlluDriverLicenseObtentionDateHelp.png',
  text: 'PaperJSON.driverLicense.obtentionDate.text',
  attributes: [
    {
      name: 'AObtentionDate',
      type: 'date',
      inputLabel: 'PaperJSON.driverLicense.AObtentionDate.inputLabel'
    }
  ]
}
const makeFakeCurrentEditInformation = ({
  metadataName,
  currentStep,
  fileMetadataName
} = {}) => {
  return {
    file: {
      metadata: {
        [fileMetadataName]: '2022-08-28T18:01:00.000Z'
      }
    },
    currentStep,
    searchParams: {
      metadataName
    }
  }
}

const makeCurrentPaperDefinition = ({ label, country } = {}) => ({
  label,
  ...(country && { country }),
  acquisitionSteps: [
    {
      model: 'scan',
      illustration: 'scan.png'
    },
    {
      model: 'information',
      illustration: 'illuNumber.png',
      attributes: [
        {
          name: 'number',
          type: 'text'
        }
      ]
    },
    {
      model: 'information',
      illustration: 'illuDate.png',
      attributes: [
        {
          name: 'expirationDate',
          type: 'date'
        }
      ]
    },
    {
      model: 'contact',
      illustration: 'contact.png'
    }
  ]
})

const makeFakeFile = ({ country, qualificationLabel } = {}) => ({
  id: '123456',
  name: 'fake file',
  metadata: {
    number: '454654876789',
    datetime: '2022-09-29T11:53:00.000Z',
    datetimeLabel: 'expirationDate',
    expirationDate: '2022-09-29T11:53:00.000Z',
    page: 'front',
    ...(country !== undefined && { country }),
    qualification: {
      label: qualificationLabel
    }
  }
})

describe('isInformationEditPermitted', () => {
  it('should return False if has not param', () => {
    const res = isInformationEditPermitted()

    expect(res).toBe(false)
  })
  it('should return False if has empty object', () => {
    const res = isInformationEditPermitted({})

    expect(res).toBe(false)
  })
  it('should return True if editing is permitted', () => {
    const fakeCurrentEditInformation = makeFakeCurrentEditInformation({
      metadataName: 'AObtentionDate',
      currentStep: informationStep,
      fileMetadataName: 'AObtentionDate'
    })
    const res = isInformationEditPermitted(fakeCurrentEditInformation)

    expect(res).toBe(true)
  })
  it('should return False if try editing "datetime" metadata', () => {
    const fakeCurrentEditInformation = makeFakeCurrentEditInformation({
      metadataName: 'datetime',
      currentStep: informationStep,
      fileMetadataName: 'AObtentionDate'
    })
    const res = isInformationEditPermitted(fakeCurrentEditInformation)

    expect(res).toBe(false)
  })
  it('should return False if the paper has no "currentStep"', () => {
    const fakeCurrentEditInformation = makeFakeCurrentEditInformation({
      metadataName: 'datetime',
      fileMetadataName: 'AObtentionDate'
    })
    const res = isInformationEditPermitted(fakeCurrentEditInformation)

    expect(res).toBe(false)
  })
  it('should return True if tries to edit a metadata that is not filled in the current file', () => {
    const fakeCurrentEditInformation = makeFakeCurrentEditInformation({
      metadataName: 'expirationDate',
      currentStep: informationStep,
      fileMetadataName: 'AObtentionDate'
    })
    const res = isInformationEditPermitted(fakeCurrentEditInformation)

    expect(res).toBe(true)
  })
})
describe('updateFileMetadata', () => {
  const newExpirationDate = '2020-01-01T12:00:00.000Z'

  it('should update the metadata "expirationDate" and "datetime" of the file', () => {
    const fakeFile = {
      id: '123456',
      name: 'fake file',
      metadata: {
        number: '454654876789',
        datetime: '2022-09-29T11:53:00.000Z',
        datetimeLabel: 'expirationDate',
        expirationDate: '2022-09-29T11:53:00.000Z',
        page: 'front'
      }
    }
    const res = updateFileMetadata({
      file: fakeFile,
      type: 'date',
      metadataName: 'expirationDate',
      value: { expirationDate: newExpirationDate }
    })

    expect(res).toEqual({
      number: '454654876789',
      datetime: newExpirationDate,
      datetimeLabel: 'expirationDate',
      expirationDate: newExpirationDate,
      page: 'front'
    })
  })

  it('should update the metadata "expirationDate" of the file', () => {
    const fakeFile = {
      id: '123456',
      name: 'fake file',
      metadata: {
        number: '454654876789',
        datetime: '2018-01-01T11:00:00.000Z',
        datetimeLabel: 'referencedDate',
        expirationDate: '2022-09-29T11:53:00.000Z',
        page: 'front'
      }
    }
    const res = updateFileMetadata({
      file: fakeFile,
      type: 'date',
      metadataName: 'expirationDate',
      value: { expirationDate: newExpirationDate }
    })

    expect(res).toEqual({
      number: '454654876789',
      datetime: '2018-01-01T11:00:00.000Z',
      datetimeLabel: 'referencedDate',
      expirationDate: newExpirationDate,
      page: 'front'
    })
  })
})
describe('makeCurrentStep', () => {
  const paperDef = makeCurrentPaperDefinition()
  describe('information model', () => {
    it('should return "information" step with "number" attribute name', () => {
      const res = makeCurrentStep({
        paperDef,
        model: 'information',
        metadataName: 'number'
      })

      expect(res).toEqual({
        attributes: [{ name: 'number', type: 'text' }],
        illustration: 'illuNumber.png',
        model: 'information'
      })
    })
    it('should return "information" step with "expirationDate" attribute name', () => {
      const res = makeCurrentStep({
        paperDef,
        model: 'information',
        metadataName: 'expirationDate'
      })

      expect(res).toEqual({
        attributes: [{ name: 'expirationDate', type: 'date' }],
        illustration: 'illuDate.png',
        model: 'information'
      })
    })
  })
  describe('page model', () => {
    it('should return "null" if model is "page', () => {
      const res = makeCurrentStep({ paperDef, model: 'page' })

      expect(res).toBe(null)
    })
  })
  describe('contact', () => {
    it('should return "contact" step', () => {
      const res = makeCurrentStep({ paperDef, model: 'contact' })

      expect(res).toEqual({
        illustration: 'contact.png',
        model: 'contact'
      })
    })
  })
  it('should return "null" if model doesn\'t exist', () => {
    const res = makeCurrentStep({
      paperDef,
      model: 'other',
      metadataName: 'expirationDate'
    })

    expect(res).toBe(null)
  })
  it('should return "null" if attribute name doesn\'t exist', () => {
    const res = makeCurrentStep({
      paperDef,
      model: 'information',
      metadataName: 'other'
    })

    expect(res).toBe(null)
  })
})
describe('updateReferencedContact', () => {
  const mockFile = {
    _id: 'fileId01',
    name: 'file01.pdf',
    relationships: {
      referenced_by: {
        data: [
          { id: 'contactId01', type: 'io.cozy.contacts' },
          { id: 'contactId02', type: 'io.cozy.contacts' }
        ]
      }
    }
  }

  const mockClient = ({
    mockaAddReferencedBy = jest.fn(),
    mockRemoveReferencedBy = jest.fn(),
    mockSave = jest.fn()
  } = {}) => {
    return {
      collection: jest.fn().mockReturnValue({
        addReferencedBy: mockaAddReferencedBy,
        removeReferencedBy: mockRemoveReferencedBy
      }),
      save: mockSave
    }
  }
  it('should early return if the list of the contacts has no changed', async () => {
    const mockaAddReferencedBy = jest.fn()
    const mockRemoveReferencedBy = jest.fn()
    const mockSave = jest.fn()
    const mockedClient = mockClient({
      mockaAddReferencedBy,
      mockRemoveReferencedBy,
      mockSave
    })

    await updateReferencedContact({
      client: mockedClient,
      currentFile: mockFile,
      contactIdsSelected: ['contactId01', 'contactId02']
    })

    expect(mockaAddReferencedBy).toBeCalledTimes(0)
    expect(mockRemoveReferencedBy).toBeCalledTimes(0)
    expect(mockSave).toBeCalledTimes(0)
  })

  it('should update & save the document if the contacts list has changed (same size)', async () => {
    const mockaAddReferencedBy = jest.fn()
    const mockRemoveReferencedBy = jest.fn()
    const mockSave = jest.fn()
    const mockedClient = mockClient({
      mockaAddReferencedBy,
      mockRemoveReferencedBy,
      mockSave
    })

    await updateReferencedContact({
      client: mockedClient,
      currentFile: mockFile,
      contactIdsSelected: ['contactId01', 'contactId03']
    })

    expect(mockaAddReferencedBy).toBeCalledTimes(1)
    expect(mockRemoveReferencedBy).toBeCalledTimes(1)
    expect(mockSave).toBeCalledTimes(1)
  })
  it('should update & save the document if the contacts list has changed (bigger)', async () => {
    const mockaAddReferencedBy = jest.fn()
    const mockRemoveReferencedBy = jest.fn()
    const mockSave = jest.fn()
    const mockedClient = mockClient({
      mockaAddReferencedBy,
      mockRemoveReferencedBy,
      mockSave
    })

    await updateReferencedContact({
      client: mockedClient,
      currentFile: mockFile,
      contactIdsSelected: ['contactId01', 'contactId02', 'contactId03']
    })

    expect(mockaAddReferencedBy).toBeCalledTimes(1)
    expect(mockRemoveReferencedBy).toBeCalledTimes(1)
    expect(mockSave).toBeCalledTimes(1)
  })
  it('should update & save the document if the contacts list has changed (Smaller)', async () => {
    const mockaAddReferencedBy = jest.fn()
    const mockRemoveReferencedBy = jest.fn()
    const mockSave = jest.fn()
    const mockedClient = mockClient({
      mockaAddReferencedBy,
      mockRemoveReferencedBy,
      mockSave
    })

    await updateReferencedContact({
      client: mockedClient,
      currentFile: mockFile,
      contactIdsSelected: ['contactId01']
    })

    expect(mockaAddReferencedBy).toBeCalledTimes(1)
    expect(mockRemoveReferencedBy).toBeCalledTimes(1)
    expect(mockSave).toBeCalledTimes(1)
  })
})
describe('getPaperDefinitionByFile', () => {
  describe('paperDefinition has no country defined', () => {
    it('should return the paperDefinition "isp_invoice"', () => {
      const fakeFile = makeFakeFile({ qualificationLabel: 'isp_invoice' })
      const res = getPaperDefinitionByFile(mockPapersDefinitions, fakeFile)

      expect(res).toMatchObject({ label: 'isp_invoice' })
    })
    it('should return the paperDefinition "isp_invoice", even if the file has a country metadata defined', () => {
      const fakeFile = makeFakeFile({
        qualificationLabel: 'isp_invoice',
        country: 'fr'
      })
      const res = getPaperDefinitionByFile(mockPapersDefinitions, fakeFile)

      expect(res).not.toMatchObject({ label: 'isp_invoice', country: 'fr' })
    })
  })
  describe('paperDefinition has a country defined', () => {
    it('should return the paperDefinition "driver_license", with the country "fr" as default', () => {
      const fakeFile = makeFakeFile({ qualificationLabel: 'driver_license' })
      const res = getPaperDefinitionByFile(mockPapersDefinitions, fakeFile)

      expect(res).toMatchObject({ label: 'driver_license', country: 'fr' })
    })
    it('should return the paperDefinition "driver_license", with the country "stranger" if defined & not "fr"', () => {
      const fakeFile = makeFakeFile({
        qualificationLabel: 'driver_license',
        country: 'en'
      })
      const res = getPaperDefinitionByFile(mockPapersDefinitions, fakeFile)

      expect(res).toMatchObject({
        label: 'driver_license',
        country: 'stranger'
      })
    })
    it('should return the paperDefinition "driver_license", with the country "stranger" if it empty in file', () => {
      const fakeFile = makeFakeFile({
        qualificationLabel: 'driver_license',
        country: ''
      })
      const res = getPaperDefinitionByFile(mockPapersDefinitions, fakeFile)

      expect(res).toMatchObject({
        label: 'driver_license',
        country: 'stranger'
      })
    })
  })
})
