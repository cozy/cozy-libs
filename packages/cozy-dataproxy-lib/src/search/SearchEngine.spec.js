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
  SHARED_DRIVES_DIR_ID: 'io.cozy.files.shared-drives-dir',
  SEARCHABLE_DOCTYPES: ['io.cozy.files', 'io.cozy.contacts', 'io.cozy.apps']
}))

// Mock realtime dependencies
jest.mock('cozy-realtime', () => ({
  RealtimePlugin: {
    pluginName: 'realtime'
  },
  __esModule: true,
  default: jest.fn()
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

// Realtime features tests
describe('Realtime features', () => {
  let searchEngine
  let mockClient
  let mockStorage
  let mockPouchLink
  let mockRealtimePlugin
  let mockCozyRealtime

  beforeEach(() => {
    mockClient = createMockClient()
    mockStorage = {
      storeData: jest.fn(),
      getData: jest.fn()
    }
    mockPouchLink = {
      doctypes: ['io.cozy.files', 'io.cozy.contacts', 'io.cozy.apps'],
      startReplicationWithDebounce: jest.fn(),
      getDbInfo: jest.fn().mockResolvedValue({ update_seq: 1 }),
      getSharedDriveDoctypes: jest.fn().mockReturnValue([])
    }

    mockRealtimePlugin = {
      subscribe: jest.fn()
    }

    mockCozyRealtime = jest.fn().mockImplementation(() => ({
      subscribe: jest.fn(),
      stop: jest.fn()
    }))

    const { getPouchLink } = require('./helpers/client')
    getPouchLink.mockReturnValue(mockPouchLink)

    const CozyRealtime = require('cozy-realtime').default
    CozyRealtime.mockImplementation(mockCozyRealtime)

    // Mock client plugins
    mockClient.plugins = {
      realtime: mockRealtimePlugin
    }
    mockClient.registerPlugin = jest.fn()
    mockClient.on = jest.fn()
    mockClient.isLogged = true

    searchEngine = new SearchEngine(mockClient, mockStorage, undefined, {
      shouldInit: false
    })
    searchEngine.isLocalSearch = true
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('init method - realtime setup', () => {
    it('should setup shared drives realtime if pouch link has shared drives doctypes', async () => {
      mockPouchLink.getSharedDriveDoctypes.mockReturnValue([
        'io.cozy.files.shareddrives-drive1',
        'io.cozy.files.shareddrives-drive2'
      ])

      await searchEngine.init()

      expect(mockCozyRealtime).toHaveBeenCalledWith({
        client: mockClient,
        sharedDriveId: 'drive1'
      })
      expect(mockCozyRealtime).toHaveBeenCalledWith({
        client: mockClient,
        sharedDriveId: 'drive2'
      })
    })
  })

  describe('handleUpdatedOrCreatedDoc method', () => {
    beforeEach(() => {
      searchEngine.searchIndexes = {
        'io.cozy.files': {
          index: { search: jest.fn() }
        }
      }
    })

    it('should return early if doctype is not a searched doctype', () => {
      const { indexSingleDoc } = require('./indexDocs')
      const doc = { _type: 'io.cozy.notsearched', _id: 'test-id' }

      searchEngine.handleUpdatedOrCreatedDoc(doc)

      expect(indexSingleDoc).not.toHaveBeenCalled()
    })

    it('should return early if no search index exists for doctype', () => {
      const { indexSingleDoc } = require('./indexDocs')
      const doc = { _type: 'io.cozy.contacts', _id: 'test-id' }

      searchEngine.handleUpdatedOrCreatedDoc(doc)

      expect(indexSingleDoc).not.toHaveBeenCalled()
    })

    it('should call indexSingleDoc for valid doctype with existing index', () => {
      const { indexSingleDoc } = require('./indexDocs')
      const doc = { _type: 'io.cozy.files', _id: 'test-id' }

      searchEngine.handleUpdatedOrCreatedDoc(doc)

      expect(indexSingleDoc).toHaveBeenCalledWith(
        searchEngine.searchIndexes['io.cozy.files'].index,
        doc
      )
    })

    it('should trigger debounced replication for local search', () => {
      const doc = { _type: 'io.cozy.files', _id: 'test-id' }
      const debouncedReplicationSpy = jest.spyOn(
        searchEngine,
        'debouncedReplication'
      )

      searchEngine.handleUpdatedOrCreatedDoc(doc)

      expect(debouncedReplicationSpy).toHaveBeenCalled()
    })

    it('should not trigger debounced replication for non-local search', () => {
      searchEngine.isLocalSearch = false
      const doc = { _type: 'io.cozy.files', _id: 'test-id' }
      const debouncedReplicationSpy = jest.spyOn(
        searchEngine,
        'debouncedReplication'
      )

      searchEngine.handleUpdatedOrCreatedDoc(doc)

      expect(debouncedReplicationSpy).not.toHaveBeenCalled()
    })
  })

  describe('handleDeletedDoc method', () => {
    beforeEach(() => {
      const mockIndex = {
        remove: jest.fn()
      }
      searchEngine.searchIndexes = {
        'io.cozy.files': {
          index: mockIndex
        }
      }
    })

    it('should return early if doctype is not a searched doctype', () => {
      const doc = { _type: 'io.cozy.notsearched', _id: 'test-id' }

      searchEngine.handleDeletedDoc(doc)

      expect(
        searchEngine.searchIndexes['io.cozy.files'].index.remove
      ).not.toHaveBeenCalled()
    })

    it('should return early if no search index exists for doctype', () => {
      const doc = { _type: 'io.cozy.contacts', _id: 'test-id' }

      searchEngine.handleDeletedDoc(doc)

      expect(
        searchEngine.searchIndexes['io.cozy.files'].index.remove
      ).not.toHaveBeenCalled()
    })

    it('should remove document from search index for valid doctype', () => {
      const doc = { _type: 'io.cozy.files', _id: 'test-id' }

      searchEngine.handleDeletedDoc(doc)

      expect(
        searchEngine.searchIndexes['io.cozy.files'].index.remove
      ).toHaveBeenCalledWith('test-id')
    })

    it('should trigger debounced replication for local search', () => {
      const doc = { _type: 'io.cozy.files', _id: 'test-id' }
      const debouncedReplicationSpy = jest.spyOn(
        searchEngine,
        'debouncedReplication'
      )

      searchEngine.handleDeletedDoc(doc)

      expect(debouncedReplicationSpy).toHaveBeenCalled()
    })

    it('should not trigger debounced replication for non-local search', () => {
      searchEngine.isLocalSearch = false
      const doc = { _type: 'io.cozy.files', _id: 'test-id' }
      const debouncedReplicationSpy = jest.spyOn(
        searchEngine,
        'debouncedReplication'
      )

      searchEngine.handleDeletedDoc(doc)

      expect(debouncedReplicationSpy).not.toHaveBeenCalled()
    })
  })

  describe('Shared drives realtime functionality', () => {
    beforeEach(() => {
      const mockRealtimeInstance = {
        subscribe: jest.fn(),
        stop: jest.fn()
      }
      mockCozyRealtime.mockReturnValue(mockRealtimeInstance)
    })

    describe('addSharedDrive method', () => {
      it('should add shared drive realtime and trigger replication', () => {
        const addSharedDriveRealtimeSpy = jest.spyOn(
          searchEngine,
          'addSharedDriveRealtime'
        )
        const debouncedReplicationSpy = jest.spyOn(
          searchEngine,
          'debouncedReplication'
        )

        searchEngine.addSharedDrive('drive1')

        expect(addSharedDriveRealtimeSpy).toHaveBeenCalledWith('drive1')
        expect(debouncedReplicationSpy).toHaveBeenCalled()
      })

      it('should not trigger replication for non-local search', () => {
        searchEngine.isLocalSearch = false
        const debouncedReplicationSpy = jest.spyOn(
          searchEngine,
          'debouncedReplication'
        )

        searchEngine.addSharedDrive('drive1')

        expect(debouncedReplicationSpy).not.toHaveBeenCalled()
      })
    })

    describe('removeSharedDrive method', () => {
      beforeEach(() => {
        const mockRealtimeInstance = {
          subscribe: jest.fn(),
          stop: jest.fn()
        }
        searchEngine.sharedDrivesRealtimes = {
          drive1: mockRealtimeInstance
        }
        searchEngine.searchIndexes = {
          'io.cozy.files.shareddrives-drive1': { index: { search: jest.fn() } }
        }
      })

      it('should stop realtime, remove from indexes and trigger replication', () => {
        const mockRealtimeInstance = searchEngine.sharedDrivesRealtimes.drive1
        const debouncedReplicationSpy = jest.spyOn(
          searchEngine,
          'debouncedReplication'
        )

        searchEngine.removeSharedDrive('drive1')

        expect(mockRealtimeInstance.stop).toHaveBeenCalled()
        expect(searchEngine.sharedDrivesRealtimes.drive1).toBeUndefined()
        expect(
          searchEngine.searchIndexes['io.cozy.files.shareddrives-drive1']
        ).toBeUndefined()
        expect(debouncedReplicationSpy).toHaveBeenCalled()
      })

      it('should handle removal of non-existent drive gracefully', () => {
        const debouncedReplicationSpy = jest.spyOn(
          searchEngine,
          'debouncedReplication'
        )

        searchEngine.removeSharedDrive('nonexistent')

        expect(debouncedReplicationSpy).toHaveBeenCalled()
      })

      it('should not trigger replication for non-local search', () => {
        searchEngine.isLocalSearch = false
        const debouncedReplicationSpy = jest.spyOn(
          searchEngine,
          'debouncedReplication'
        )

        searchEngine.removeSharedDrive('drive1')

        expect(debouncedReplicationSpy).not.toHaveBeenCalled()
      })
    })

    describe('addSharedDriveRealtime private method', () => {
      it('should create CozyRealtime instance and subscribe to files doctype', () => {
        const mockRealtimeInstance = {
          subscribe: jest.fn(),
          stop: jest.fn()
        }
        mockCozyRealtime.mockReturnValue(mockRealtimeInstance)

        searchEngine.addSharedDriveRealtime('drive1')

        expect(mockCozyRealtime).toHaveBeenCalledWith({
          client: mockClient,
          sharedDriveId: 'drive1'
        })
        expect(mockRealtimeInstance.subscribe).toHaveBeenCalledWith(
          'created',
          consts.FILES_DOCTYPE,
          expect.any(Function)
        )
        expect(mockRealtimeInstance.subscribe).toHaveBeenCalledWith(
          'updated',
          consts.FILES_DOCTYPE,
          expect.any(Function)
        )
        expect(mockRealtimeInstance.subscribe).toHaveBeenCalledWith(
          'deleted',
          consts.FILES_DOCTYPE,
          expect.any(Function)
        )
        expect(searchEngine.sharedDrivesRealtimes.drive1).toBe(
          mockRealtimeInstance
        )
      })
    })
  })
})
