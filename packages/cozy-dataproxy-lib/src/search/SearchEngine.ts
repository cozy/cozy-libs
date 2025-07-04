import FlexSearch from 'flexsearch'

import CozyClient, { defaultPerformanceApi } from 'cozy-client'
import type { PerformanceAPI } from 'cozy-client/types/performances/types'
import Minilog from 'cozy-minilog'
import { RealtimePlugin } from 'cozy-realtime'

import {
  SEARCH_SCHEMA,
  APPS_DOCTYPE,
  FILES_DOCTYPE,
  CONTACTS_DOCTYPE,
  DOCTYPE_DEFAULT_ORDER,
  LIMIT_DOCTYPE_SEARCH,
  SearchedDoctype,
  SEARCHABLE_DOCTYPES
} from './consts'
import { getPouchLink } from './helpers/client'
import {
  enrichResultsWithDocs,
  normalizeSearchResult
} from './helpers/normalizeSearchResult'
import { isDebug } from './helpers/utils'
import {
  indexAllDocs,
  indexOnChanges,
  indexSingleDoc,
  initDoctypeAfterIndexImport,
  initSearchIndex
} from './indexDocs'
import { queryLocalOrRemoteDocs } from './queries'
import {
  importSearchIndexes,
  exportSearchIndexes,
  getExportDate
} from './storage'
import {
  CozyDoc,
  RawSearchResult,
  isIOCozyApp,
  isIOCozyContact,
  isIOCozyFile,
  SearchIndex,
  SearchIndexes,
  SearchResult,
  isSearchedDoctype,
  SearchOptions,
  StorageInterface,
  EnrichedSearchResult
} from './types'

const log = Minilog('🗂️ [Indexing]')

interface FlexSearchResultWithDoctype
  extends FlexSearch.SimpleDocumentSearchResultSetUnit {
  doctype: SearchedDoctype
}

interface EngineOptions {
  shouldInit?: boolean
}

export class SearchEngine {
  client: CozyClient
  searchIndexes: SearchIndexes
  debouncedReplication: () => void
  isLocalSearch: boolean
  storage: StorageInterface
  performanceApi: PerformanceAPI
  engineOptions: EngineOptions

  constructor(
    client: CozyClient,
    storage: StorageInterface,
    performanceApi?: PerformanceAPI,
    engineOptions: EngineOptions = {}
  ) {
    this.client = client
    this.searchIndexes = {} as SearchIndexes
    this.storage = storage
    this.performanceApi = performanceApi ?? defaultPerformanceApi
    this.engineOptions = { shouldInit: true, ...engineOptions }

    this.isLocalSearch = !!getPouchLink(this.client)
    log.info('Use local data on trusted device: ', this.isLocalSearch)

    this.debouncedReplication = (): void => {
      const pouchLink = getPouchLink(client)
      if (pouchLink) {
        pouchLink.startReplicationWithDebounce()
      }
    }

    if (this.client.isLogged) {
      this.afterLogin()
    } else {
      this.client.on('login', () => {
        this.afterLogin()
      })
    }
  }

  afterLogin(): void {
    if (this.engineOptions.shouldInit) {
      void this.init()
    }
    // Use replication events to have up-to-date search indexes, based on local data
    this.handleReplicationEvents()
  }

  async indexDocumentsAtInit(): Promise<void> {
    if (!this.client) {
      return
    }

    log.info('Initialize indexes...')
    const markName = this.performanceApi.mark('indexDocuments')

    const lastExportDate = await getExportDate(this.storage)
    if (!lastExportDate || !this.isLocalSearch) {
      // No persisted index: let's create them
      for (const doctype of SEARCHABLE_DOCTYPES) {
        const searchIndex = await this.indexDocsForSearch(
          doctype as keyof typeof SEARCH_SCHEMA
        )
        if (searchIndex) {
          this.searchIndexes[doctype] = searchIndex
        }
      }
    } else {
      // Import local indexes
      await this.initSearchWithIndexImport()
    }

    this.performanceApi.measure({
      markName: markName,
      category: 'Search'
    })
  }

  handleReplicationEvents(): void {
    if (!this.isLocalSearch) {
      // Nothing to do here, we do not want to replicate for non-local search
      return
    }

    let startReplicationTime = 0,
      endReplicationTime = 0

    this.client.on('pouchlink:doctypesync:end', async (doctype: string) => {
      if (isSearchedDoctype(doctype) && this.searchIndexes[doctype]) {
        // Here, the index already exist, so let's have an incremental update
        const searchIndex = await this.indexDocsForSearch(
          doctype as keyof typeof SEARCH_SCHEMA
        )
        if (searchIndex) {
          this.searchIndexes[doctype] = searchIndex
        }
      }
    })
    this.client.on('pouchlink:sync:start', () => {
      log.debug('Started pouch replication')
      startReplicationTime = performance.now()
    })
    this.client.on('pouchlink:sync:end', async () => {
      log.debug('Ended pouch replication')

      endReplicationTime = performance.now()
      if (startReplicationTime > 0) {
        // Log only if the start replication event was correctly get
        log.debug(
          `Replication took ${(
            endReplicationTime - startReplicationTime
          ).toFixed(2)} ms`
        )
      }
      if (Object.keys(this.searchIndexes).length < 1) {
        log.info('No search index found: start indexing')
        // This happens at first replication, so init the indexes
        await this.indexDocumentsAtInit()
      }
      // Save up-to-date index on storage to be later imported
      void exportSearchIndexes(this.storage, this.searchIndexes)
    })
  }

  async init(): Promise<void> {
    // Ensure login is done before plugin register
    if (!this.client.plugins[RealtimePlugin.pluginName]) {
      this.client.registerPlugin(RealtimePlugin, {})
    }

    // Realtime subscription
    this.handleUpdatedOrCreatedDoc = this.handleUpdatedOrCreatedDoc.bind(this)
    this.handleDeletedDoc = this.handleDeletedDoc.bind(this)
    this.subscribeDoctype(this.client, FILES_DOCTYPE)
    this.subscribeDoctype(this.client, CONTACTS_DOCTYPE)
    this.subscribeDoctype(this.client, APPS_DOCTYPE)

    // The document indexing should be performed once everything is setup
    await this.indexDocumentsAtInit()
  }

  subscribeDoctype(client: CozyClient, doctype: string): void {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/unbound-method */
    const realtime = client.plugins.realtime
    realtime.subscribe('created', doctype, this.handleUpdatedOrCreatedDoc)
    realtime.subscribe('updated', doctype, this.handleUpdatedOrCreatedDoc)
    realtime.subscribe('deleted', doctype, this.handleDeletedDoc)
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/unbound-method */
  }

  handleUpdatedOrCreatedDoc(doc: CozyDoc): void {
    const doctype = doc._type
    if (!isSearchedDoctype(doctype)) {
      return
    }
    const searchIndex = this.searchIndexes?.[doctype]
    if (!searchIndex) {
      // No index yet: it will be done by querying the local db after first replication
      return
    }
    log.debug('[REALTIME] Update doc from index after update : ', doc._id)
    void indexSingleDoc(this.client, searchIndex.index, doc)

    if (this.isLocalSearch) {
      this.debouncedReplication()
    }
  }

  handleDeletedDoc(doc: CozyDoc): void {
    const doctype = doc._type
    if (!isSearchedDoctype(doctype)) {
      return
    }
    const searchIndex = this.searchIndexes?.[doctype]
    if (!searchIndex) {
      // No index yet: it will be done by querying the local db after first replication
      return
    }
    log.debug('[REALTIME] Remove doc from index after update : ', doc._id)
    this.searchIndexes[doctype].index.remove(doc._id!)

    if (this.isLocalSearch) {
      this.debouncedReplication()
    }
  }

  /**
   * Initialize indexes by:
   *  - importing persisted indexes
   *  - Requesting remote changes if the indexes are stale
   *  - Query the local database to load the redux store
   */
  async initSearchWithIndexImport(): Promise<void> {
    const startImport = performance.now()
    this.searchIndexes = await importSearchIndexes(this.storage)
    const endImport = performance.now()

    if (isDebug()) {
      log.debug(`Index import took ${(endImport - startImport).toFixed(2)} ms`)
    }

    for (const doctype of SEARCHABLE_DOCTYPES) {
      const searchIndex = this.searchIndexes[doctype]
      if (!searchIndex) {
        // The index import probably have failed: let's rebuild it
        const newSearchIndex = await this.indexDocsForSearch(
          doctype as keyof typeof SEARCH_SCHEMA
        )
        if (newSearchIndex) {
          this.searchIndexes[doctype] = newSearchIndex
        }
      }
      // The indexes might be stale: update them
      await indexOnChanges(this, this.searchIndexes[doctype], doctype)

      // The doctype needs some extra treatment to initialize everything correctly
      void initDoctypeAfterIndexImport(this.client, doctype)
    }
  }

  buildSearchIndex(
    doctype: keyof typeof SEARCH_SCHEMA,
    docs: CozyDoc[]
  ): FlexSearch.Document<CozyDoc, false> {
    const startTimeIndex = performance.now()

    const flexsearchIndex = initSearchIndex(doctype)
    indexAllDocs(flexsearchIndex, docs, this.isLocalSearch)

    const endTimeIndex = performance.now()
    log.debug(
      `Create ${doctype} index took ${(endTimeIndex - startTimeIndex).toFixed(
        2
      )} ms`
    )
    return flexsearchIndex
  }

  async getLocalLastSeq(doctype: keyof typeof SEARCH_SCHEMA): Promise<number> {
    if (this.isLocalSearch) {
      const pouchLink = getPouchLink(this.client)
      const info = pouchLink ? await pouchLink.getDbInfo(doctype) : null
      return info?.update_seq || 0
    }
    return -1
  }

  async initialIndexation(
    doctype: keyof typeof SEARCH_SCHEMA
  ): Promise<SearchIndex | null> {
    const docs = await queryLocalOrRemoteDocs(this.client, doctype, {
      isLocalSearch: this.isLocalSearch
    })
    if (docs.length < 1) {
      // No docs available yet
      return null
    }
    const index = this.buildSearchIndex(doctype, docs)
    const lastSeq = await this.getLocalLastSeq(doctype)

    this.searchIndexes[doctype] = {
      index,
      lastSeq,
      lastUpdated: new Date().toISOString()
    }
    return this.searchIndexes[doctype]
  }

  async incrementalIndexation(
    doctype: keyof typeof SEARCH_SCHEMA,
    searchIndex: SearchIndex
  ): Promise<SearchIndex> {
    return indexOnChanges(this, searchIndex, doctype)
  }

  async indexDocsForSearch(
    doctype: keyof typeof SEARCH_SCHEMA
  ): Promise<SearchIndex | null> {
    const markeNameIndex = this.performanceApi.mark(
      `indexDocsForSearch ${doctype}`
    )
    const searchIndex = this.searchIndexes[doctype]
    const startIndexing = performance.now()

    let index
    if (!searchIndex) {
      // First creation of search index
      index = await this.initialIndexation(doctype)
      if (!index) {
        this.performanceApi.measure({
          markName: markeNameIndex,
          measureName: `${markeNameIndex} initial indexation`,
          category: 'Search'
        })
        return null
      }
    } else {
      // At this point, the search index is supposed to be already up-to-date,
      // thanks to the realtime.
      // However, we check if it is actually the case for safety, and update the lastSeq
      index = await this.incrementalIndexation(doctype, searchIndex)
    }

    const endIndexing = performance.now()
    if (isDebug()) {
      log.debug(
        `Indexing ${doctype} took ${(endIndexing - startIndexing).toFixed(
          2
        )} ms`
      )
    }

    this.performanceApi.measure({
      markName: markeNameIndex,
      measureName: `${markeNameIndex} incremental indexation`,
      category: 'Search'
    })

    return index
  }

  async search(
    query: string,
    options: SearchOptions | undefined
  ): Promise<SearchResult[] | null> {
    if (!this.searchIndexes || Object.keys(this.searchIndexes).length < 1) {
      // The indexing might be running but not finished yet
      log.warn('[SEARCH] No search index available')
      return null
    }

    const markeNameIndex = this.performanceApi.mark('search')

    const allResults = this.searchOnIndexes(query, options?.doctypes)
    const dedupResults = this.deduplicateAndFlatten(allResults)
    const enrichedResults = await enrichResultsWithDocs(
      this.client,
      dedupResults
    )
    const sortedResults = this.sortSearchResults(
      enrichedResults,
      options?.doctypes
    )
    const results = this.limitSearchResults(sortedResults)

    const normResults: SearchResult[] = []
    for (const res of results) {
      const normalizedRes = normalizeSearchResult(this.client, res, query)
      normResults.push(normalizedRes)
    }
    const output = normResults.filter(res => res.title)

    this.performanceApi.measure({
      markName: markeNameIndex,
      category: 'Search'
    })
    return output
  }

  searchOnIndexes(
    query: string,
    searchOnDoctypes: string[] | undefined
  ): FlexSearchResultWithDoctype[] {
    let searchResults: FlexSearchResultWithDoctype[] = []
    for (const key in this.searchIndexes) {
      const doctype = key as SearchedDoctype // XXX - Should not be necessary

      if (searchOnDoctypes && !searchOnDoctypes.includes(doctype)) {
        // Search only on specified doctypes
        continue
      }

      const index = this.searchIndexes[doctype]
      if (!index) {
        log.warn('[SEARCH] No search index available for ', doctype)
        continue
      }
      // XXX - The limit is specified twice because of a flexsearch inconstency
      // that does not enforce the limit if only given in second argument, and
      // does not return the correct type is only given in third options
      //
      // XXX - The given limit here is arbitrary because flexsearch enforce it on matching
      // field, which can cause issue related to the sort: if we search on name+path for files,
      // and limit on 100, the 101th result on name will be skipped, but might appear on path,
      // which will make it appear in the search results, but in incorrect order.
      //
      // Search result example:
      // [
      //   {
      //       "field": "displayName",
      //       "result": [
      //           "604627c6bafee013ec5f27f7f72029f6"
      //       ]
      //   },
      //   {
      //       "field": "fullname",
      //       "result": [
      //           "604627c6bafee013ec5f27f7f72029f6", "604627c6bafee013ec5f27f3f714568"
      //       ]
      //   }
      // ]
      const FLEXSEARCH_LIMIT = 10000
      const indexResults = index.index.search(query, FLEXSEARCH_LIMIT, {
        limit: FLEXSEARCH_LIMIT,
        enrich: false
      })

      const newResults = indexResults.map(res => ({
        ...res,
        doctype: doctype
      }))
      searchResults = searchResults.concat(newResults)
    }

    return searchResults
  }

  deduplicateAndFlatten(
    searchResults: FlexSearchResultWithDoctype[]
  ): RawSearchResult[] {
    const combinedResults = searchResults.flatMap(item =>
      item.result.map(id => ({
        id: id.toString(), // Because of flexsearch Id typing
        doctype: item.doctype,
        field: item.field
      }))
    )

    const resultMap = new Map<string, RawSearchResult>()

    combinedResults.forEach(({ id, field, doctype }) => {
      if (resultMap.has(id)) {
        resultMap.get(id)?.fields.push(field)
      } else {
        resultMap.set(id, { id, fields: [field], doctype })
      }
    })

    return [...resultMap.values()]
  }

  compareStrings(str1: string, str2: string): number {
    if (!str1 && !str2) {
      return 0
    } else if (!str1) {
      return 1
    } else if (!str2) {
      return -1
    }
    return str1.localeCompare(str2, undefined, { numeric: true })
  }

  sortSearchResults(
    searchResults: EnrichedSearchResult[],
    doctypesOrder: string[] | undefined
  ): EnrichedSearchResult[] {
    return searchResults.sort((a, b) => {
      let doctypeComparison
      if (doctypesOrder) {
        doctypeComparison =
          doctypesOrder.findIndex(dt => dt === a.doctype) -
          doctypesOrder.findIndex(dt => dt === b.doctype)
      } else {
        doctypeComparison =
          DOCTYPE_DEFAULT_ORDER[a.doctype] - DOCTYPE_DEFAULT_ORDER[b.doctype]
      }

      if (doctypeComparison !== 0) return doctypeComparison
      if (
        a.doctype === APPS_DOCTYPE &&
        isIOCozyApp(a.doc) &&
        isIOCozyApp(b.doc)
      ) {
        return this.compareStrings(a.doc?.slug, b.doc?.slug)
      } else if (
        a.doctype === CONTACTS_DOCTYPE &&
        isIOCozyContact(a.doc) &&
        isIOCozyContact(b.doc)
      ) {
        return this.compareStrings(a.doc?.displayName, b.doc?.displayName)
      } else if (
        a.doctype === FILES_DOCTYPE &&
        isIOCozyFile(a.doc) &&
        isIOCozyFile(b.doc)
      ) {
        return this.sortFiles(a, b)
      }

      return 0
    })
  }

  sortFiles(aRes: EnrichedSearchResult, bRes: EnrichedSearchResult): number {
    if (!isIOCozyFile(aRes.doc) || !isIOCozyFile(bRes.doc)) {
      return 0
    }
    if (!aRes.fields.includes('name') || !bRes.fields.includes('name')) {
      // First, sort docs with a match on the name field
      return aRes.fields.includes('name') ? -1 : 1
    }
    if (aRes.doc.type !== bRes.doc.type) {
      // Then, directories
      return aRes.doc.type === 'directory' ? -1 : 1
    }
    // Then name
    return this.compareStrings(aRes.doc?.name, bRes.doc?.name)
  }

  limitSearchResults(
    searchResults: EnrichedSearchResult[]
  ): EnrichedSearchResult[] {
    const doctypesCount: Record<string, number> = {}
    return searchResults.filter(result => {
      const doctype = result.doctype
      if (doctypesCount[doctype]) {
        doctypesCount[doctype] += 1
      } else {
        doctypesCount[doctype] = 1
      }
      return doctypesCount[doctype] <= LIMIT_DOCTYPE_SEARCH
    })
  }
}
