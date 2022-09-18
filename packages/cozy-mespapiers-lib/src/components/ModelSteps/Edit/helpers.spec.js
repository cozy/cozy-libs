import { isInformationEditPermitted, updateFileMetadata } from './helpers'

const currentStep = {
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
const setup = ({ metadataName, currentStep } = {}) => {
  return {
    file: {
      metadata: {
        AObtentionDate: '2022-08-28T18:01:00.000Z'
      }
    },
    currentStep,
    searchParams: {
      metadataName
    }
  }
}
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
    const res = isInformationEditPermitted(
      setup({ metadataName: 'AObtentionDate', currentStep })
    )

    expect(res).toBe(true)
  })
  it('should return False if try editing "datetime" metadata', () => {
    const res = isInformationEditPermitted(
      setup({ metadataName: 'datetime', currentStep })
    )

    expect(res).toBe(false)
  })
  it('should return False if the paper has no "currentStep"', () => {
    const res = isInformationEditPermitted(setup({ metadataName: 'datetime' }))

    expect(res).toBe(false)
  })
  it('should return False if tries to edit a metadata that does not exist on current file', () => {
    const res = isInformationEditPermitted(
      setup({ metadataName: 'expirationDate' })
    )

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
