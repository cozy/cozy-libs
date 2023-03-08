import { makeRealtimeConnection, search } from './helpers'
import { index } from './search'

jest.mock('./search', () => ({
  ...jest.requireActual('./search'),
  index: {
    search: jest.fn()
  }
}))

const mockT = x => x
const searchResult = [
  {
    field: 'name',
    result: [{ id: '01', doc: { _id: '01', _type: 'io.cozy.files' } }]
  },
  {
    field: 'flexsearchProps:translatedQualificationLabel',
    result: [
      { id: '01', doc: { _id: '01', _type: 'io.cozy.files' } },
      { id: '02', doc: { _id: '02', _type: 'io.cozy.files' } }
    ]
  }
]

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
    index.search.mockReturnValue(searchResult)
    const res = search({
      docs: [{ _id: '01', name: 'Certificat de naissance' }],
      value: 'naissance', // ignored because of mocked search result
      tag: undefined // ignored because of mocked search result
    })

    expect(res).toStrictEqual([{ _id: '01', name: 'Certificat de naissance' }])
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
