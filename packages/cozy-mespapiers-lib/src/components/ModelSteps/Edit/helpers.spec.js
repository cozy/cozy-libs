import {
  isInformationEditPermitted,
  updateFileMetadata,
  makeCurrentStep
} from './helpers'

const informationStep = {
  stepIndex: 4,
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

const makeCurrentPaperDefinition = () => ({
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
          name: 'cardNumber',
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
  it('should return False if tries to edit a metadata that does not exist on current file', () => {
    const fakeCurrentEditInformation = makeFakeCurrentEditInformation({
      metadataName: 'expirationDate',
      currentStep: informationStep,
      fileMetadataName: 'AObtentionDate'
    })
    const res = isInformationEditPermitted(fakeCurrentEditInformation)

    expect(res).toBe(false)
  })
})
describe('updateFileMetadata', () => {
  const newExpirationDate = '2020-01-01T12:00:00.000Z'

  it('should update the metadata "expirationDate" and "datetime" of the file', () => {
    const fakeFile = {
      id: '123456',
      name: 'fake file',
      metadata: {
        cardNumber: '454654876789',
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
      cardNumber: '454654876789',
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
        cardNumber: '454654876789',
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
      cardNumber: '454654876789',
      datetime: '2018-01-01T11:00:00.000Z',
      datetimeLabel: 'referencedDate',
      expirationDate: newExpirationDate,
      page: 'front'
    })
  })
})
describe('makeCurrentStep', () => {
  it('should return "information" step with "cardNumber" attribute name', () => {
    const currentPaperDef = makeCurrentPaperDefinition()
    const res = makeCurrentStep(currentPaperDef, 'information', 'cardNumber')

    expect(res).toEqual({
      attributes: [{ name: 'cardNumber', type: 'text' }],
      illustration: 'illuNumber.png',
      model: 'information'
    })
  })
  it('should return "information" step with "expirationDate" attribute name', () => {
    const currentPaperDef = makeCurrentPaperDefinition()
    const res = makeCurrentStep(
      currentPaperDef,
      'information',
      'expirationDate'
    )

    expect(res).toEqual({
      attributes: [{ name: 'expirationDate', type: 'date' }],
      illustration: 'illuDate.png',
      model: 'information'
    })
  })

  it('should return "null" if model is "page', () => {
    const currentPaperDef = makeCurrentPaperDefinition()
    const res = makeCurrentStep(currentPaperDef, 'page')

    expect(res).toBe(null)
  })
  it('should return "null" if model doesn\'t exist', () => {
    const currentPaperDef = makeCurrentPaperDefinition()
    const res = makeCurrentStep(currentPaperDef, 'other', 'expirationDate')

    expect(res).toBe(null)
  })
  it('should return "null" if attribute name doesn\'t exist', () => {
    const currentPaperDef = makeCurrentPaperDefinition()
    const res = makeCurrentStep(currentPaperDef, 'information', 'other')

    expect(res).toBe(null)
  })
})
