import {
  makePapers,
  makeQualificationLabelWithoutFiles,
  makeKonnectorsAndQualificationLabelWithoutFiles,
  makeAccountsByFiles
} from './helpers'

const papersDefinitionsLabels = ['caf', 'isp_invoice', 'resume']

describe('makePapers', () => {
  it('should return only file with matched qualification label', () => {
    const files = [
      { metadata: { qualification: { label: 'caf' } } },
      { metadata: { qualification: { label: 'lease' } } }
    ]
    const res = makePapers(papersDefinitionsLabels, files)

    expect(res).toStrictEqual([
      { metadata: { qualification: { label: 'caf' } } }
    ])
  })

  it('should return empty array if no match', () => {
    const files = [
      { metadata: { qualification: { label: 'house_insurance' } } },
      { metadata: { qualification: { label: 'lease' } } }
    ]
    const res = makePapers(papersDefinitionsLabels, files)

    expect(res).toStrictEqual([])
  })
})

describe('makeQualificationLabelWithoutFiles', () => {
  it('should return labels for which there is no associated paper', () => {
    const files = [
      { metadata: { qualification: { label: 'caf' } } },
      { metadata: { qualification: { label: 'lease' } } }
    ]
    const res = makeQualificationLabelWithoutFiles(
      papersDefinitionsLabels,
      files
    )

    expect(res).toStrictEqual(['isp_invoice', 'resume'])
  })

  it('should return empty array if no paper left', () => {
    const files = [
      { metadata: { qualification: { label: 'caf' } } },
      { metadata: { qualification: { label: 'isp_invoice' } } },
      { metadata: { qualification: { label: 'resume' } } }
    ]
    const res = makeQualificationLabelWithoutFiles(
      papersDefinitionsLabels,
      files
    )

    expect(res).toStrictEqual([])
  })
})

describe('makeKonnectorsAndQualificationLabelWithoutFiles', () => {
  it('should return konnectors with their qualification labels for which there is no file', () => {
    const konnectors = [
      { qualification_labels: ['caf', 'isp_invoice'] },
      { qualification_labels: ['lease'] }
    ]
    const qualificationLabelWithoutFiles = ['caf', 'phone_invoice']

    const res = makeKonnectorsAndQualificationLabelWithoutFiles(
      konnectors,
      qualificationLabelWithoutFiles
    )

    expect(res).toStrictEqual([
      {
        konnector: { qualification_labels: ['caf', 'isp_invoice'] },
        konnectorQualifLabelsWithoutFile: ['caf']
      },
      {
        konnector: { qualification_labels: ['lease'] },
        konnectorQualifLabelsWithoutFile: []
      }
    ])
  })

  it('should return empty array in konnectorQualifLabelsWithoutFile if no qualification_labels attributes on konnectors', () => {
    const konnectors = [{ _id: '01' }, { _id: '02' }]
    const qualificationLabelWithoutFiles = ['caf', 'phone_invoice']

    const res = makeKonnectorsAndQualificationLabelWithoutFiles(
      konnectors,
      qualificationLabelWithoutFiles
    )

    expect(res).toStrictEqual([
      {
        konnector: { _id: '01' },
        konnectorQualifLabelsWithoutFile: []
      },
      {
        konnector: { _id: '02' },
        konnectorQualifLabelsWithoutFile: []
      }
    ])
  })
})

describe('makeAccountsByFiles', () => {
  it('should return accounts with files and accounts without files', () => {
    const accounts = [
      { auth: { login: 'account1' } },
      { auth: { login: 'account2' } },
      { auth: { login: 'account3' } }
    ]
    const files = [
      { cozyMetadata: { sourceAccountIdentifier: 'account1' } },
      { cozyMetadata: { sourceAccountIdentifier: 'account3' } }
    ]

    const res = makeAccountsByFiles(accounts, files)

    expect(res).toStrictEqual({
      accountsWithFiles: [
        { auth: { login: 'account1' } },
        { auth: { login: 'account3' } }
      ],
      accountsWithoutFiles: [{ auth: { login: 'account2' } }]
    })
  })
})
