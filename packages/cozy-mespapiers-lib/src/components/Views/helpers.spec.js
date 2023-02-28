import { makePapers, makeQualificationLabelWithoutFiles } from './helpers'

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
