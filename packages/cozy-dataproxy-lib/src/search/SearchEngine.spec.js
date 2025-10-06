import { createMockClient } from 'cozy-client'

import { SearchEngine } from './SearchEngine'
import * as consts from './consts'
jest.mock('flexsearch')
jest.mock('flexsearch/dist/module/lang/latin/simple')

jest.mock('./helpers/client', () => ({
  getPouchLink: jest.fn()
}))
jest.mock('./helpers/getSearchEncoder', () => ({
  getSearchEncoder: jest.fn()
}))
jest.mock('./helpers/normalizeSearchResult', () => ({
  enrichResultsWithDocs: jest.fn(),
  normalizeSearchResult: jest.fn()
}))
jest.mock('./storage', () => ({
  getExportDate: jest.fn(),
  importSearchIndexes: jest.fn(),
  exportSearchIndexes: jest.fn()
}))
jest.mock('./indexDocs', () => ({
  indexAllDocs: jest.fn(),
  indexOnChanges: jest.fn(),
  indexSingleDoc: jest.fn(),
  initDoctypeAfterIndexImport: jest.fn(),
  initSearchIndex: jest.fn()
}))
jest.mock('./queries', () => ({
  queryLocalOrRemoteDocs: jest.fn()
}))
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
  APPS_DOCTYPE: 'io.cozy.apps',
  SHARED_DRIVE_FILES_DOCTYPE: 'io.cozy.files.shareddrives',
  SEARCHABLE_DOCTYPES: ['io.cozy.files', 'io.cozy.contacts', 'io.cozy.apps']
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

describe('getSharedDrivesDoctypes', () => {
  let searchEngine
  let mockClient
  let mockPouchLink

  beforeEach(() => {
    mockClient = createMockClient()
    mockPouchLink = {
      doctypes: [
        'io.cozy.files',
        'io.cozy.contacts',
        'io.cozy.apps',
        'io.cozy.files.shareddrives.drive1',
        'io.cozy.files.shareddrives.drive2'
      ]
    }

    const { getPouchLink } = require('./helpers/client')
    getPouchLink.mockReturnValue(mockPouchLink)

    searchEngine = new SearchEngine(mockClient, {}, undefined, {
      shouldInit: false
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return shared drives doctypes when pouch link exists', () => {
    const sharedDrivesDoctypes = searchEngine.getSharedDrivesDoctypes()

    expect(sharedDrivesDoctypes).toEqual([
      'io.cozy.files.shareddrives.drive1',
      'io.cozy.files.shareddrives.drive2'
    ])
  })

  it('should return empty array when pouch link does not exist', () => {
    const { getPouchLink } = require('./helpers/client')
    getPouchLink.mockReturnValue(null)

    const sharedDrivesDoctypes = searchEngine.getSharedDrivesDoctypes()

    expect(sharedDrivesDoctypes).toEqual([])
  })

  it('should return empty array when no shared drives doctypes exist', () => {
    mockPouchLink.doctypes = [
      'io.cozy.files',
      'io.cozy.contacts',
      'io.cozy.apps'
    ]

    const sharedDrivesDoctypes = searchEngine.getSharedDrivesDoctypes()

    expect(sharedDrivesDoctypes).toEqual([])
  })
})

describe('search method with shared drives integration', () => {
  let searchEngine
  let mockClient
  let mockPouchLink
  let mockStorage

  beforeEach(() => {
    mockClient = createMockClient()
    mockStorage = {
      storeData: jest.fn(),
      getData: jest.fn()
    }
    mockPouchLink = {
      doctypes: [
        'io.cozy.files',
        'io.cozy.contacts',
        'io.cozy.apps',
        'io.cozy.files.shareddrives.drive1',
        'io.cozy.files.shareddrives.drive2'
      ]
    }

    const { getPouchLink } = require('./helpers/client')
    getPouchLink.mockReturnValue(mockPouchLink)

    searchEngine = new SearchEngine(mockClient, mockStorage, undefined, {
      shouldInit: false
    })

    // Mock search indexes with shared drives
    searchEngine.searchIndexes = {
      'io.cozy.files': { index: { search: jest.fn().mockReturnValue([]) } },
      'io.cozy.files.shareddrives.drive1': {
        index: { search: jest.fn().mockReturnValue([]) }
      },
      'io.cozy.files.shareddrives.drive2': {
        index: { search: jest.fn().mockReturnValue([]) }
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should include shared drives doctypes when searching files without specific doctypes', async () => {
    const {
      enrichResultsWithDocs,
      normalizeSearchResult
    } = require('./helpers/normalizeSearchResult')
    enrichResultsWithDocs.mockResolvedValue([])
    normalizeSearchResult.mockReturnValue({ title: 'test', doc: {} })

    const searchOnIndexesSpy = jest.spyOn(searchEngine, 'searchOnIndexes')
    searchOnIndexesSpy.mockReturnValue([])

    await searchEngine.search('test query', {
      doctypes: [consts.FILES_DOCTYPE]
    })

    expect(searchOnIndexesSpy).toHaveBeenCalledWith('test query', [
      consts.FILES_DOCTYPE,
      'io.cozy.files.shareddrives.drive1',
      'io.cozy.files.shareddrives.drive2'
    ])
  })

  it('should include shared drives doctypes when searching without specific doctypes', async () => {
    const {
      enrichResultsWithDocs,
      normalizeSearchResult
    } = require('./helpers/normalizeSearchResult')
    enrichResultsWithDocs.mockResolvedValue([])
    normalizeSearchResult.mockReturnValue({ title: 'test', doc: {} })

    const searchOnIndexesSpy = jest.spyOn(searchEngine, 'searchOnIndexes')
    searchOnIndexesSpy.mockReturnValue([])

    await searchEngine.search('test query', {})

    expect(searchOnIndexesSpy).toHaveBeenCalledWith('test query', [
      'io.cozy.files.shareddrives.drive1',
      'io.cozy.files.shareddrives.drive2'
    ])
  })

  it('should not include shared drives doctypes when searching specific non-files doctypes', async () => {
    const {
      enrichResultsWithDocs,
      normalizeSearchResult
    } = require('./helpers/normalizeSearchResult')
    enrichResultsWithDocs.mockResolvedValue([])
    normalizeSearchResult.mockReturnValue({ title: 'test', doc: {} })

    const searchOnIndexesSpy = jest.spyOn(searchEngine, 'searchOnIndexes')
    searchOnIndexesSpy.mockReturnValue([])

    await searchEngine.search('test query', {
      doctypes: [consts.CONTACTS_DOCTYPE]
    })

    expect(searchOnIndexesSpy).toHaveBeenCalledWith('test query', [
      consts.CONTACTS_DOCTYPE
    ])
  })

  it('should clean up non-existing doctypes from search indexes', async () => {
    // Set up search indexes with doctypes that don't exist in pouch link
    searchEngine.searchIndexes = {
      'io.cozy.files': { index: { search: jest.fn().mockReturnValue([]) } },
      'io.cozy.files.shareddrives.drive1': {
        index: { search: jest.fn().mockReturnValue([]) }
      },
      'non.existing.doctype': {
        index: { search: jest.fn().mockReturnValue([]) }
      }
    }

    const {
      enrichResultsWithDocs,
      normalizeSearchResult
    } = require('./helpers/normalizeSearchResult')
    enrichResultsWithDocs.mockResolvedValue([])
    normalizeSearchResult.mockReturnValue({ title: 'test', doc: {} })

    const searchOnIndexesSpy = jest.spyOn(searchEngine, 'searchOnIndexes')
    searchOnIndexesSpy.mockReturnValue([])

    await searchEngine.search('test query', {})

    // Check that non-existing doctype was removed
    expect(searchEngine.searchIndexes['non.existing.doctype']).toBeUndefined()
    expect(searchEngine.searchIndexes['io.cozy.files']).toBeDefined()
    expect(
      searchEngine.searchIndexes['io.cozy.files.shareddrives.drive1']
    ).toBeDefined()
  })
})

describe('indexDocumentsAtInit with shared drives', () => {
  let searchEngine
  let mockClient
  let mockStorage
  let mockPouchLink

  beforeEach(() => {
    mockClient = createMockClient()
    mockStorage = {
      storeData: jest.fn(),
      getData: jest.fn().mockResolvedValue(null) // No persisted index
    }
    mockPouchLink = {
      doctypes: [
        'io.cozy.files',
        'io.cozy.contacts',
        'io.cozy.apps',
        'io.cozy.files.shareddrives.drive1',
        'io.cozy.files.shareddrives.drive2'
      ]
    }

    const { getPouchLink } = require('./helpers/client')
    getPouchLink.mockReturnValue(mockPouchLink)

    searchEngine = new SearchEngine(mockClient, mockStorage, undefined, {
      shouldInit: false
    })
    searchEngine.isLocalSearch = true
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should index shared drives doctypes during initialization', async () => {
    const { getExportDate } = require('./storage')
    const { queryLocalOrRemoteDocs } = require('./queries')
    const { initSearchIndex, indexAllDocs } = require('./indexDocs')

    getExportDate.mockResolvedValue(null) // No persisted index
    queryLocalOrRemoteDocs.mockResolvedValue([])
    initSearchIndex.mockReturnValue({ search: jest.fn() })
    indexAllDocs.mockImplementation(() => {})

    const indexDocsForSearchSpy = jest.spyOn(searchEngine, 'indexDocsForSearch')
    indexDocsForSearchSpy.mockResolvedValue({
      index: { search: jest.fn() },
      lastSeq: 1,
      lastUpdated: new Date().toISOString()
    })

    await searchEngine.indexDocumentsAtInit()

    // Should be called for standard doctypes + shared drives doctypes
    expect(indexDocsForSearchSpy).toHaveBeenCalledWith('io.cozy.files')
    expect(indexDocsForSearchSpy).toHaveBeenCalledWith('io.cozy.contacts')
    expect(indexDocsForSearchSpy).toHaveBeenCalledWith('io.cozy.apps')
    expect(indexDocsForSearchSpy).toHaveBeenCalledWith(
      'io.cozy.files.shareddrives.drive1'
    )
    expect(indexDocsForSearchSpy).toHaveBeenCalledWith(
      'io.cozy.files.shareddrives.drive2'
    )
  })
})
