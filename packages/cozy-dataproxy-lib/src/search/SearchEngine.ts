import FlexSearch from 'flexsearch'

import CozyClient from 'cozy-client'
import Minilog from 'cozy-minilog'
import { RealtimePlugin } from 'cozy-realtime'

import {
  SEARCH_SCHEMA,
  APPS_DOCTYPE,
  FILES_DOCTYPE,
  CONTACTS_DOCTYPE,
  DOCTYPE_ORDER,
  LIMIT_DOCTYPE_SEARCH,
  SearchedDoctype,
  SEARCHABLE_DOCTYPES
} from './consts'
import { getPouchLink } from './helpers/client'
import { getSearchEncoder } from './helpers/getSearchEncoder'
import {
  addFilePaths,
  computeFileFullpath,
  shouldKeepFile
} from './helpers/normalizeFile'
import { normalizeSearchResult } from './helpers/normalizeSearchResult'
import { queryAllDocs, queryFilesForSearch } from './queries'
import {
  CozyDoc,
  RawSearchResult,
  isIOCozyApp,
  isIOCozyContact,
  isIOCozyFile,
  SearchIndex,
  SearchIndexes,
  SearchResult,
  isSearchedDoctype
} from './types'

const log = Minilog('🗂️ [Indexing]')

interface FlexSearchResultWithDoctype
  extends FlexSearch.EnrichedDocumentSearchResultSetUnit<CozyDoc> {
  doctype: SearchedDoctype
}

export class SearchEngine {
  client: CozyClient
  searchIndexes: SearchIndexes
  debouncedReplication: () => void
  isLocalSearch: boolean

  constructor(client: CozyClient) {
    this.client = client
    this.searchIndexes = {} as SearchIndexes

    this.isLocalSearch = !!getPouchLink(this.client)
    log.info('Use local data on trusted device : ', this.isLocalSearch)

    this.debouncedReplication = (): void => {
      const pouchLink = getPouchLink(client)
      if (pouchLink) {
        pouchLink.startReplicationWithDebounce()
      }
    }
    void this.indexDocuments()
  }

  async indexDocuments(): Promise<void> {
    if (!this.client) {
      return
    }
    let startReplicationTime = 0,
      endReplicationTime = 0
    if (!this.isLocalSearch) {
      // In case of non-local search, force the indexing for all doctypes
      // For local search, this will be done automatically after initial replication
      for (const doctype of SEARCHABLE_DOCTYPES) {
        this.searchIndexes[doctype] = await this.indexDocsForSearch(
          doctype as keyof typeof SEARCH_SCHEMA
        )
      }
    }
    if (this.isLocalSearch) {
      this.client.on('pouchlink:doctypesync:end', async (doctype: string) => {
        if (isSearchedDoctype(doctype)) {
          // Index doctype after initial replication
          this.searchIndexes[doctype] = await this.indexDocsForSearch(
            doctype as keyof typeof SEARCH_SCHEMA
          )
        }
      })
      this.client.on('pouchlink:sync:start', () => {
        log.debug('Started pouch replication')
        startReplicationTime = performance.now()
      })
      this.client.on('pouchlink:sync:end', () => {
        log.debug('Ended pouch replication')
        endReplicationTime = performance.now()
        log.debug(
          `Replication took ${(
            endReplicationTime - startReplicationTime
          ).toFixed(2)}`
        )
      })
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
    // Ensure login is done before plugin register
    this.client.registerPlugin(RealtimePlugin, {})

    // Realtime subscription
    this.handleUpdatedOrCreatedDoc = this.handleUpdatedOrCreatedDoc.bind(this)
    this.handleDeletedDoc = this.handleDeletedDoc.bind(this)
    this.subscribeDoctype(this.client, FILES_DOCTYPE)
    this.subscribeDoctype(this.client, CONTACTS_DOCTYPE)
    this.subscribeDoctype(this.client, APPS_DOCTYPE)
  }

  subscribeDoctype(client: CozyClient, doctype: string): void {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/unbound-method */
    // @ts-expect-error Client's plugins are not typed
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
    log.debug('[REALTIME] Update doc from index after update : ', doc)
    void this.addDocToIndex(searchIndex.index, doc)

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
    log.debug('[REALTIME] Remove doc from index after update : ', doc)
    this.searchIndexes[doctype].index.remove(doc._id!)

    if (this.isLocalSearch) {
      this.debouncedReplication()
    }
  }

  buildSearchIndex(
    doctype: keyof typeof SEARCH_SCHEMA,
    docs: CozyDoc[]
  ): FlexSearch.Document<CozyDoc, true> {
    const startTimeIndex = performance.now()

    const fieldsToIndex = SEARCH_SCHEMA[doctype]

    const flexsearchIndex = new FlexSearch.Document<CozyDoc, true>({
      tokenize: 'forward',
      encode: getSearchEncoder(),
      // @ts-expect-error minlength is not described by Flexsearch types but exists
      minlength: 2,
      document: {
        id: '_id',
        index: fieldsToIndex,
        store: true
      }
    })

    // There is no persisted path for files: we must add it
    const completedDocs = this.isLocalSearch ? addFilePaths(docs) : docs
    for (const doc of completedDocs) {
      void this.addDocToIndex(flexsearchIndex, doc)
    }

    const endTimeIndex = performance.now()
    log.debug(
      `Create ${doctype} index took ${(endTimeIndex - startTimeIndex).toFixed(
        2
      )} ms`
    )
    return flexsearchIndex
  }

  async addDocToIndex(
    flexsearchIndex: FlexSearch.Document<CozyDoc, true>,
    doc: CozyDoc
  ): Promise<void> {
    if (this.shouldIndexDoc(doc)) {
      let docToIndex = doc
      if (isIOCozyFile(doc)) {
        // Add path for files
        docToIndex = await computeFileFullpath(this.client, doc)
      }
      flexsearchIndex.add(docToIndex)
    }
  }

  shouldIndexDoc(doc: CozyDoc): boolean {
    if (isIOCozyFile(doc)) {
      return shouldKeepFile(doc)
    }
    return true
  }

  async getLocalLastSeq(doctype: keyof typeof SEARCH_SCHEMA): Promise<number> {
    if (this.isLocalSearch) {
      const pouchLink = getPouchLink(this.client)
      const info = pouchLink ? await pouchLink.getDbInfo(doctype) : null
      return info?.update_seq || 0
    }
    return -1
  }

  async queryLocalOrRemoteDocs(
    doctype: keyof typeof SEARCH_SCHEMA
  ): Promise<CozyDoc[]> {
    let docs = []
    const startTimeQ = performance.now()

    if (!this.isLocalSearch && doctype === FILES_DOCTYPE) {
      // Special case for stack's files
      docs = await queryFilesForSearch(this.client)
    } else {
      docs = await queryAllDocs(this.client, doctype)
    }
    const endTimeQ = performance.now()
    log.debug(
      `Query ${docs.length} ${doctype} took ${(endTimeQ - startTimeQ).toFixed(
        2
      )} ms`
    )
    return docs
  }

  async initialIndexation(
    doctype: keyof typeof SEARCH_SCHEMA
  ): Promise<SearchIndex> {
    const docs = await this.queryLocalOrRemoteDocs(doctype)
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
    const pouchLink = getPouchLink(this.client)
    if (!this.isLocalSearch || !pouchLink) {
      // No need to handle incremental indexation for non-local search: it is already done through realtime
      return searchIndex
    }
    const lastSeq = searchIndex.lastSeq || 0
    const changes = await pouchLink.getChanges(doctype, {
      include_docs: true,
      since: lastSeq
    })

    for (const change of changes.results) {
      if (change.deleted) {
        searchIndex.index.remove(change.id)
      } else {
        const normalizedDoc = { ...change.doc, _type: doctype } as CozyDoc
        void this.addDocToIndex(searchIndex.index, normalizedDoc)
      }
    }

    searchIndex.lastSeq = changes.last_seq
    searchIndex.lastUpdated = new Date().toISOString()
    return searchIndex
  }

  async indexDocsForSearch(
    doctype: keyof typeof SEARCH_SCHEMA
  ): Promise<SearchIndex> {
    const searchIndex = this.searchIndexes[doctype]

    if (!searchIndex) {
      // First creation of search index
      return this.initialIndexation(doctype)
    }

    // At this point, the search index is supposed to be already up-to-date,
    // thanks to the realtime.
    // However, we check if it is actually the case for safety, and update the lastSeq
    return this.incrementalIndexation(doctype, searchIndex)
  }

  search(query: string): SearchResult[] {
    if (!this.searchIndexes) {
      // TODO: What if the indexing is running but not finished yet?
      log.warn('[SEARCH] No search index available')
      return []
    }

    const allResults = this.searchOnIndexes(query)
    const dedupResults = this.deduplicateAndFlatten(allResults)
    const sortedResults = this.sortSearchResults(dedupResults)
    const results = this.limitSearchResults(sortedResults)

    const normResults: SearchResult[] = []
    for (const res of results) {
      const normalizedRes = normalizeSearchResult(this.client, res, query)
      normResults.push(normalizedRes)
    }
    return normResults.filter(res => res.title)
  }

  searchOnIndexes(query: string): FlexSearchResultWithDoctype[] {
    let searchResults: FlexSearchResultWithDoctype[] = []
    for (const key in this.searchIndexes) {
      const doctype = key as SearchedDoctype // XXX - Should not be necessary
      const index = this.searchIndexes[doctype]
      if (!index) {
        log.warn('[SEARCH] No search index available for ', doctype)
        continue
      }
      // TODO: do not use flexsearch store and rely on pouch storage?
      // It's better for memory, but might slow down search queries
      //
      // XXX - The limit is specified twice because of a flexsearch inconstency
      // that does not enforce the limit if only given in second argument, and
      // does not return the correct type is only given in third options
      //
      // XXX - The given limit here is arbitrary because flexsearch enforce it on matching
      // field, which can cause issue related to the sort: if we search on name+path for files,
      // and limit on 100, the 101th result on name will be skipped, but might appear on path,
      // which will make it appear in the search results, but in incorrect order.
      const FLEXSEARCH_LIMIT = 10000
      const indexResults = index.index.search(query, FLEXSEARCH_LIMIT, {
        limit: FLEXSEARCH_LIMIT,
        enrich: true
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
      item.result.map(r => ({ ...r, field: item.field, doctype: item.doctype }))
    )

    type MapItem = Omit<(typeof combinedResults)[number], 'field'> & {
      fields: string[]
    }
    const resultMap = new Map<FlexSearch.Id[], MapItem>()

    combinedResults.forEach(({ id, field, ...rest }) => {
      if (resultMap.has(id)) {
        resultMap.get(id)?.fields.push(field)
      } else {
        resultMap.set(id, { id, fields: [field], ...rest })
      }
    })

    return [...resultMap.values()]
  }

  compareStrings(str1: string, str2: string): number {
    return str1.localeCompare(str2, undefined, { numeric: true })
  }

  sortSearchResults(searchResults: RawSearchResult[]): RawSearchResult[] {
    return searchResults.sort((a, b) => {
      const doctypeComparison =
        DOCTYPE_ORDER[a.doctype] - DOCTYPE_ORDER[b.doctype]
      if (doctypeComparison !== 0) return doctypeComparison
      if (
        a.doctype === APPS_DOCTYPE &&
        isIOCozyApp(a.doc) &&
        isIOCozyApp(b.doc)
      ) {
        return this.compareStrings(a.doc.slug, b.doc.slug)
      } else if (
        a.doctype === CONTACTS_DOCTYPE &&
        isIOCozyContact(a.doc) &&
        isIOCozyContact(b.doc)
      ) {
        return this.compareStrings(a.doc.displayName, b.doc.displayName)
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

  sortFiles(aRes: RawSearchResult, bRes: RawSearchResult): number {
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
    return this.compareStrings(aRes.doc.name, bRes.doc.name)
  }

  limitSearchResults(searchResults: RawSearchResult[]): RawSearchResult[] {
    return searchResults.slice(0, LIMIT_DOCTYPE_SEARCH)
  }
}
