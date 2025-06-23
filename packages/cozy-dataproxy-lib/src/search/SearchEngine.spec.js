import { createMockClient } from 'cozy-client'

import { SearchEngine } from './SearchEngine'
import * as consts from './consts'
import { initSearchIndex } from './indexDocs'
// jest.mock('flexsearch')
// jest.mock('flexsearch/dist/module/lang/latin/simple')

// jest.mock('./helpers/client', () => ({
//   getPouchLink: jest.fn()
// }))
// jest.mock('./helpers/getSearchEncoder', () => ({
//   getSearchEncoder: jest.fn()
// }))
jest.mock('./consts', () => ({
  LIMIT_DOCTYPE_SEARCH: 3,
  SEARCH_SCHEMA: {
    'io.cozy.files': ['name', 'path'],
    'io.cozy.contacts': ['displayName', 'fullname'],
    'io.cozy.apps': ['slug', 'name']
  },
  DOCTYPE_DEFAULT_ORDER: {
    'io.cozy.apps': 0,
    'io.cozy.contacts': 1,
    'io.cozy.files': 2
  },
  FILES_DOCTYPE: 'io.cozy.files',
  CONTACTS_DOCTYPE: 'io.cozy.contacts',
  APPS_DOCTYPE: 'io.cozy.apps'
}))

describe('searchOnIndexes', () => {
  let searchEngine
  beforeEach(async () => {
    const client = createMockClient()
    searchEngine = new SearchEngine(client)
    const searchIndex = initSearchIndex('io.cozy.files')
    searchEngine.searchIndexes['io.cozy.files'] = {
      index: searchIndex
    }
    const docs = [
      { _id: '1', _type: 'io.cozy.files', name: 'test1' },
      { _id: '2', _type: 'io.cozy.files', name: 'test2' },
      { _id: '3', _type: 'io.cozy.files', name: 'aaaa' }
    ]

    for (const doc of docs) {
      searchEngine.searchIndexes['io.cozy.files'].index.add(doc)
    }
    console.log('index : ', searchEngine.searchIndexes['io.cozy.files'].index)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return search results', async () => {
    const searchResults = await searchEngine.searchOnIndexes('test')
    expect(searchResults.length).toEqual(2)
  })
})

// describe('search test', () => {
//   it('should index', () => {
//     const fieldsToIndex = ['name']
//     const flexsearchIndex = new FlexSearch.Document({
//       tokenize: 'reverse', // See https://github.com/nextapps-de/flexsearch?tab=readme-ov-file#tokenizer
//       encode: getSearchEncoder(),
//       // @ts-expect-error minlength is not described by Flexsearch types but exists
//       minlength: 3,
//       document: {
//         id: '_id',
//         index: fieldsToIndex,
//         store: true // Use redux store to get docs
//       }
//     })
//   })
// })

describe('sortSearchResults', () => {
  let searchEngine
  beforeEach(() => {
    const client = createMockClient()
    searchEngine = new SearchEngine(client)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should sort results by doctype order', () => {
    const searchResults = [
      { doctype: consts.FILES_DOCTYPE, doc: { _type: consts.FILES_DOCTYPE } },
      { doctype: consts.APPS_DOCTYPE, doc: { _type: consts.APPS_DOCTYPE } },
      {
        doctype: consts.CONTACTS_DOCTYPE,
        doc: { _type: consts.CONTACTS_DOCTYPE }
      }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doctype).toBe(consts.APPS_DOCTYPE)
    expect(sortedResults[1].doctype).toBe(consts.CONTACTS_DOCTYPE)
    expect(sortedResults[2].doctype).toBe(consts.FILES_DOCTYPE)
  })

  it('should sort apps by slug', () => {
    const searchResults = [
      {
        doctype: consts.APPS_DOCTYPE,
        doc: { slug: 'appB', _type: consts.APPS_DOCTYPE }
      },
      {
        doctype: consts.APPS_DOCTYPE,
        doc: { slug: 'appA', _type: consts.APPS_DOCTYPE }
      }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doc.slug).toBe('appA')
    expect(sortedResults[1].doc.slug).toBe('appB')
  })

  it('should sort contacts by displayName', () => {
    const searchResults = [
      {
        doctype: consts.CONTACTS_DOCTYPE,
        doc: { displayName: 'June', _type: consts.CONTACTS_DOCTYPE }
      },
      {
        doctype: consts.CONTACTS_DOCTYPE,
        doc: { displayName: 'Alice', _type: consts.CONTACTS_DOCTYPE }
      }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doc.displayName).toBe('Alice')
    expect(sortedResults[1].doc.displayName).toBe('June')
  })

  it('should sort files by type and name', () => {
    const searchResults = [
      {
        doctype: consts.FILES_DOCTYPE,
        doc: { name: 'fileB', type: 'file', _type: consts.FILES_DOCTYPE },
        fields: ['name']
      },
      {
        doctype: consts.FILES_DOCTYPE,
        doc: { name: 'fileA', type: 'file', _type: consts.FILES_DOCTYPE },
        fields: ['name']
      },
      {
        doctype: consts.FILES_DOCTYPE,
        doc: {
          name: 'folderA',
          type: 'directory',
          _type: consts.FILES_DOCTYPE
        },
        fields: ['name']
      }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doc.type).toBe('directory') // Folders should come first
    expect(sortedResults[1].doc.name).toBe('fileA')
    expect(sortedResults[2].doc.name).toBe('fileB')
  })

  it('should sort files first if they match on name, then path', () => {
    const searchResults = [
      {
        doctype: consts.FILES_DOCTYPE,
        doc: {
          name: 'test11',
          path: 'test/test11',
          type: 'file',
          _type: consts.FILES_DOCTYPE
        },
        fields: ['name']
      },
      {
        doctype: consts.FILES_DOCTYPE,
        doc: {
          name: 'test1',
          path: 'test/test1',
          type: 'file',
          _type: consts.FILES_DOCTYPE
        },
        fields: ['name']
      },
      {
        doctype: consts.FILES_DOCTYPE,
        doc: {
          name: 'DirName1',
          path: 'test1/path',
          type: 'directory',
          _type: consts.FILES_DOCTYPE
        },
        fields: ['path']
      },
      {
        doctype: consts.FILES_DOCTYPE,
        doc: {
          name: 'DirName2',
          path: 'test1/path',
          type: 'directory',
          _type: consts.FILES_DOCTYPE
        },
        fields: ['name']
      }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doc.name).toBe('DirName2') // Dir match on name
    expect(sortedResults[1].doc.name).toBe('test1') // File match on name
    expect(sortedResults[2].doc.name).toBe('test11') // File match on name
    expect(sortedResults[3].doc.name).toBe('DirName1') // Directory
  })
})

describe('limitSearchResults', () => {
  let searchEngine
  beforeEach(() => {
    const client = createMockClient()
    searchEngine = new SearchEngine(client)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return all results if doctype count is below or equal the limit', () => {
    const searchResults = [
      { doctype: consts.FILES_DOCTYPE, id: 1 },
      { doctype: consts.FILES_DOCTYPE, id: 2 },
      { doctype: consts.FILES_DOCTYPE, id: 3 }
    ]

    const filteredResults = searchEngine.limitSearchResults(searchResults)
    expect(filteredResults).toEqual(searchResults)
  })

  it('should filter results exceeding the limit for a specific doctype', () => {
    const searchResults = [
      { doctype: consts.FILES_DOCTYPE, id: 1 },
      { doctype: consts.FILES_DOCTYPE, id: 2 },
      { doctype: consts.FILES_DOCTYPE, id: 3 },
      { doctype: consts.FILES_DOCTYPE, id: 4 },
      { doctype: consts.CONTACTS_DOCTYPE, id: 5 }
    ]

    const filteredResults = searchEngine.limitSearchResults(searchResults)
    expect(filteredResults).toEqual([
      { doctype: consts.FILES_DOCTYPE, id: 1 },
      { doctype: consts.FILES_DOCTYPE, id: 2 },
      { doctype: consts.FILES_DOCTYPE, id: 3 },
      { doctype: consts.CONTACTS_DOCTYPE, id: 5 }
    ])
  })

  it('should return an empty array if input is empty', () => {
    const searchResults = []
    const filteredResults = searchEngine.limitSearchResults(searchResults)
    expect(filteredResults).toEqual([])
  })
})
