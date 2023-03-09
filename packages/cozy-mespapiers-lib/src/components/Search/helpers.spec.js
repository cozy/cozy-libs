import { makeRealtimeConnection, search, makeReducedResultIds } from './helpers'
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

  it('should return empty array if no search result', () => {
    index.search.mockReturnValue([])
    const res = search({})

    expect(res).toStrictEqual([])
  })

  it('should return the matched document', () => {
    const indexedDocs = [
      {
        _id: '01',
        name: 'Certificat de naissance',
        flexsearchProps: { translatedQualificationLabel: 'naissance' }
      },
      {
        _id: '02',
        name: 'attestation',
        flexsearchProps: { translatedQualificationLabel: 'naissance' }
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
        field: 'flexsearchProps:translatedQualificationLabel',
        result: ['01', '02']
      }
    ])
    const res = search({
      docs: indexedDocs,
      value: 'naissance', // ignored because of mocked search result
      tag: undefined // ignored because of mocked search result
    })

    expect(res).toStrictEqual([
      {
        _id: '01',
        name: 'Certificat de naissance',
        flexsearchProps: { translatedQualificationLabel: 'naissance' }
      },
      {
        _id: '02',
        name: 'attestation',
        flexsearchProps: { translatedQualificationLabel: 'naissance' }
      }
    ])
  })

  it('should return empty array if no matching documents', () => {
    index.search.mockReturnValue([{ field: 'name', result: [] }])
    const res = search({
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
