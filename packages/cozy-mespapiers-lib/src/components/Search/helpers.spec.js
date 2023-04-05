import {
  makeRealtimeConnection,
  search,
  makeReducedResultIds,
  makeFileTags,
  makeContactTags,
  makeFileFlexsearchProps,
  makeMultipleSearchResultIds
} from './helpers'
import { index } from './search'

jest.mock('./search', () => ({
  ...jest.requireActual('./search'),
  index: {
    search: jest.fn()
  }
}))

const mockT = x => x

describe('makeRealtimeConnection', () => {
  it('should return a well structured object', () => {
    const res = makeRealtimeConnection(
      ['io.cozy.files', 'io.cozy.contacts'],
      mockT
    )

    expect(res).toStrictEqual({
      'io.cozy.contacts': {
        created: expect.any(Function),
        updated: expect.any(Function)
      },
      'io.cozy.files': {
        created: expect.any(Function),
        updated: expect.any(Function)
      }
    })
  })
})

describe('search', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return empty array if no search result', async () => {
    index.search.mockReturnValue([])
    const res = await search({ value: '' })

    expect(res).toStrictEqual({
      filteredDocs: [],
      firstSearchResultMatchingAttributes: []
    })
  })

  it('should return the matched document', async () => {
    const indexedDocs = [
      {
        _id: '01',
        name: 'Certificat de naissance',
        flexsearchProps: { translated: { qualificationLabel: 'naissance' } }
      },
      {
        _id: '02',
        name: 'attestation',
        flexsearchProps: { translated: { qualificationLabel: 'naissance' } }
      },
      {
        _id: '03',
        fullname: 'Victor'
      }
    ]

    index.search.mockReturnValue([
      {
        field: 'name',
        result: ['01']
      },
      {
        field: 'flexsearchProps:translated:qualificationLabel',
        result: ['01', '02']
      }
    ])
    const res = await search({
      docs: indexedDocs,
      value: 'naissance', // ignored because of mocked search result
      tag: undefined // ignored because of mocked search result
    })

    expect(res).toStrictEqual({
      filteredDocs: [
        {
          _id: '01',
          flexsearchProps: { translated: { qualificationLabel: 'naissance' } },
          name: 'Certificat de naissance'
        },
        {
          _id: '02',
          flexsearchProps: { translated: { qualificationLabel: 'naissance' } },
          name: 'attestation'
        }
      ],
      firstSearchResultMatchingAttributes: [
        'name',
        'flexsearchProps:translated:qualificationLabel'
      ]
    })
  })

  it('should return empty array if no matching documents', async () => {
    index.search.mockReturnValue([{ field: 'name', result: [] }])
    const res = await search({
      docs: [{ _id: '01', name: 'Certificat de naissance' }],
      value: 'naissance', // ignored because of mocked search result
      tag: undefined // ignored because of mocked search result
    })

    expect(res).toStrictEqual({
      filteredDocs: [],
      firstSearchResultMatchingAttributes: []
    })
  })
})

describe('makeReducedResultIds', () => {
  it('should return deduplicated ids in the same order', () => {
    const res = makeReducedResultIds([
      { field: 'name', result: ['id01', 'id04'] },
      { field: 'fullname', result: ['id03', 'id02'] },
      { field: 'civility', result: ['id01', 'id03'] }
    ])

    expect(res).toStrictEqual(['id01', 'id04', 'id03', 'id02'])
  })
})

describe('makeFileTags', () => {
  it('should return the theme label of tax_return qualification', () => {
    const res = makeFileTags({
      metadata: { qualification: { label: 'tax_return' } }
    })

    expect(res).toStrictEqual(['finance'])
  })

  it('should return the theme labels of driver_license qualification', () => {
    const res = makeFileTags({
      metadata: { qualification: { label: 'driver_license' } }
    })

    expect(res).toStrictEqual(['identity', 'transport'])
  })

  it('should return empty array if no qualification', () => {
    const res = makeFileTags({ metadata: {} })

    expect(res).toStrictEqual([])
  })
})

describe('makeContactTags', () => {
  it('should return the theme label `identity` for a contact with a given name', () => {
    const res = makeContactTags({ name: { givenName: 'Jason' } })

    expect(res).toStrictEqual(['identity'])
  })

  it('should return the theme label `work_study` for a contact with a company', () => {
    const res = makeContactTags({ company: 'Cozy' })

    expect(res).toStrictEqual(['work_study'])
  })

  it('should return the theme labels for a contact with an address', () => {
    const res = makeContactTags({
      address: [{ formattedAddress: '2 place Victor Hugo' }]
    })

    expect(res).toStrictEqual(['home', 'work_study', 'identity'])
  })
})

describe('makeFileFlexsearchProps', () => {
  it('should return correct translatedRefTaxIncome', () => {
    const res = makeFileFlexsearchProps({
      doc: {
        metadata: { qualification: { label: 'others' }, refTaxIncome: 123456 }
      },
      scannerT: mockT,
      t: mockT
    })

    expect(res).toStrictEqual({
      tag: [],
      translated: {
        qualificationLabel: 'items.others',
        'metadata.refTaxIncome': 'Search.attributeLabel.metadata.refTaxIncome'
      }
    })
  })

  it('should return correct tags and translated metadata', () => {
    const res = makeFileFlexsearchProps({
      doc: {
        metadata: {
          qualification: { label: 'driver_license' },
          refTaxIncome: 123456,
          contractType: 'cdi'
        }
      },
      scannerT: mockT,
      t: mockT
    })

    expect(res).toStrictEqual({
      tag: ['identity', 'transport'],
      translated: {
        qualificationLabel: 'items.driver_license',
        'metadata.refTaxIncome': 'Search.attributeLabel.metadata.refTaxIncome',
        'metadata.contractType': 'Search.attributeLabel.metadata.contractType',
        driverLicense: 'Search.attributeLabel.metadata.driver_license'
      }
    })
  })
})

describe('makeMultipleSearchResultIds', () => {
  it('should', () => {
    const res = makeMultipleSearchResultIds([
      [
        { field: 'name', result: ['id01', 'id04'] },
        { field: 'fullname', result: ['id03', 'id02'] }
      ],
      [{ field: 'civility', result: ['id01', 'id05'] }]
    ])

    expect(res).toStrictEqual(['id01'])
  })
})
