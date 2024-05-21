import {
  makeRealtimeConnection,
  search,
  makeReducedResultIds,
  makeFileTags,
  makeContactTags,
  makeFileFlexsearchProps,
  makeMultipleSearchResultIds,
  filterResultIds,
  makeContactFlexsearchProps
} from './helpers'
import { index } from './search'

jest.mock('./search', () => ({
  ...jest.requireActual('./search'),
  index: {
    search: jest.fn()
  }
}))

const mockT = x => x

describe('makeContactFlexsearchProps', () => {
  const expectedResult = {
    'address[0].formattedAddress': '2 place Victor Hugo',
    'email[0].address': 'victor@hugo.cc',
    'phone[0].number': '0123456789',
    tag: ['identity', 'home', 'work_study'],
    translated: {
      address: 'Search.attributeLabel.address',
      email: 'Search.attributeLabel.email',
      phone: 'Search.attributeLabel.phone'
    }
  }
  it('should return correct formatted contact for flexsearch', () => {
    const res = makeContactFlexsearchProps(
      {
        name: { givenName: 'Victor', familyName: 'Hugo' },
        email: [{ address: 'victor@hugo.cc' }],
        phone: [{ number: '0123456789' }],
        company: 'Cozy',
        address: [{ formattedAddress: '2 place Victor Hugo' }]
      },
      mockT
    )

    expect(res).toStrictEqual(expectedResult)
  })
  it('should return correct formatted contact for flexsearch when email is a String', () => {
    const res = makeContactFlexsearchProps(
      {
        name: { givenName: 'Victor', familyName: 'Hugo' },
        email: 'victor@hugo.cc',
        phone: [{ number: '0123456789' }],
        company: 'Cozy',
        address: [{ formattedAddress: '2 place Victor Hugo' }]
      },
      mockT
    )

    expect(res).toStrictEqual(expectedResult)
  })
})

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

    expect(res).toStrictEqual([])
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

    expect(res).toStrictEqual([
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
    ])
  })

  it('should return empty array if no matching documents', async () => {
    index.search.mockReturnValue([{ field: 'name', result: [] }])
    const res = await search({
      docs: [{ _id: '01', name: 'Certificat de naissance' }],
      value: 'naissance', // ignored because of mocked search result
      tag: undefined // ignored because of mocked search result
    })

    expect(res).toStrictEqual([])
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
      scannerT: mockT
    })

    expect(res).toStrictEqual({
      tag: [],
      translated: {
        qualificationLabel: 'items.others',
        'metadata.refTaxIncome': 'qualification.information.title.refTaxIncome'
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
      scannerT: mockT
    })

    expect(res).toStrictEqual({
      tag: ['identity', 'transport'],
      translated: {
        qualificationLabel: 'items.driver_license',
        'metadata.refTaxIncome': 'qualification.information.title.refTaxIncome',
        'metadata.contractType': 'qualification.information.title.contractType',
        driverLicense: 'qualification.information.title.driver_license.number'
      }
    })
  })
})

describe('makeMultipleSearchResultIds', () => {
  it('should return only ids that matches multiple fields ', () => {
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

describe('filterResultIds', () => {
  it('should return only docs that matcheds with ids', () => {
    const res = filterResultIds(
      ['id01', 'id02'],
      [{ _id: 'id01' }, { _id: 'id02' }, { _id: 'id03' }]
    )

    expect(res).toStrictEqual([{ _id: 'id01' }, { _id: 'id02' }])
  })

  it('should return docs filtered by date', () => {
    const res = filterResultIds(
      ['id01', 'id02'],
      [
        {
          _id: 'id01',
          metadata: { datetime: '2024-04-01T01:00:00.000Z' }
        },
        {
          _id: 'id02',
          metadata: { datetime: '2024-05-01T01:00:00.000Z' }
        }
      ]
    )

    expect(res).toStrictEqual([
      {
        _id: 'id02',
        metadata: { datetime: '2024-05-01T01:00:00.000Z' }
      },
      {
        _id: 'id01',
        metadata: { datetime: '2024-04-01T01:00:00.000Z' }
      }
    ])
  })

  it('should return empty array if no match', () => {
    const res = filterResultIds(['id04'], [{ _id: 'id01' }])

    expect(res).toStrictEqual([])
  })

  it('should return empty array if no result', () => {
    const res = filterResultIds([], [{ _id: 'id01' }])

    expect(res).toStrictEqual([])
  })
})
