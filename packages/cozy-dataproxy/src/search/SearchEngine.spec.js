import { createMockClient } from 'cozy-client'

import { APPS_DOCTYPE, CONTACTS_DOCTYPE, FILES_DOCTYPE } from '@/search/consts'

import SearchEngine from './SearchEngine'

jest.mock('cozy-client')
jest.mock('flexsearch')
jest.mock('flexsearch/dist/module/lang/latin/balance')

jest.mock('@/search/helpers/client', () => ({
  getPouchLink: jest.fn()
}))
jest.mock('@/search/helpers/getSearchEncoder', () => ({
  getSearchEncoder: jest.fn()
}))

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
      { doctype: FILES_DOCTYPE, doc: { _type: FILES_DOCTYPE } },
      { doctype: APPS_DOCTYPE, doc: { _type: APPS_DOCTYPE } },
      { doctype: CONTACTS_DOCTYPE, doc: { _type: CONTACTS_DOCTYPE } }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doctype).toBe(APPS_DOCTYPE)
    expect(sortedResults[1].doctype).toBe(CONTACTS_DOCTYPE)
    expect(sortedResults[2].doctype).toBe(FILES_DOCTYPE)
  })

  it('should sort apps by slug', () => {
    const searchResults = [
      { doctype: APPS_DOCTYPE, doc: { slug: 'appB', _type: APPS_DOCTYPE } },
      { doctype: APPS_DOCTYPE, doc: { slug: 'appA', _type: APPS_DOCTYPE } }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doc.slug).toBe('appA')
    expect(sortedResults[1].doc.slug).toBe('appB')
  })

  it('should sort contacts by displayName', () => {
    const searchResults = [
      {
        doctype: CONTACTS_DOCTYPE,
        doc: { displayName: 'June', _type: CONTACTS_DOCTYPE }
      },
      {
        doctype: CONTACTS_DOCTYPE,
        doc: { displayName: 'Alice', _type: CONTACTS_DOCTYPE }
      }
    ]

    const sortedResults = searchEngine.sortSearchResults(searchResults)

    expect(sortedResults[0].doc.displayName).toBe('Alice')
    expect(sortedResults[1].doc.displayName).toBe('June')
  })

  it('should sort files by type and name', () => {
    const searchResults = [
      {
        doctype: FILES_DOCTYPE,
        doc: { name: 'fileB', type: 'file', _type: FILES_DOCTYPE },
        fields: ['name']
      },
      {
        doctype: FILES_DOCTYPE,
        doc: { name: 'fileA', type: 'file', _type: FILES_DOCTYPE },
        fields: ['name']
      },
      {
        doctype: FILES_DOCTYPE,
        doc: { name: 'folderA', type: 'directory', _type: FILES_DOCTYPE },
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
        doctype: FILES_DOCTYPE,
        doc: {
          name: 'test11',
          path: 'test/test11',
          type: 'file',
          _type: FILES_DOCTYPE
        },
        fields: ['name']
      },
      {
        doctype: FILES_DOCTYPE,
        doc: {
          name: 'test1',
          path: 'test/test1',
          type: 'file',
          _type: FILES_DOCTYPE
        },
        fields: ['name']
      },
      {
        doctype: FILES_DOCTYPE,
        doc: {
          name: 'DirName1',
          path: 'test1/path',
          type: 'directory',
          _type: FILES_DOCTYPE
        },
        fields: ['path']
      },
      {
        doctype: FILES_DOCTYPE,
        doc: {
          name: 'DirName2',
          path: 'test1/path',
          type: 'directory',
          _type: FILES_DOCTYPE
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
