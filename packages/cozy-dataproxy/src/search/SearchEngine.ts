import FlexSearch from 'flexsearch'

import CozyClient, { Q } from 'cozy-client'
import Minilog from 'cozy-minilog'
import { RealtimePlugin } from 'cozy-realtime'

import {
  SEARCH_SCHEMA,
  APPS_DOCTYPE,
  FILES_DOCTYPE,
  CONTACTS_DOCTYPE,
  DOCTYPE_ORDER,
  LIMIT_DOCTYPE_SEARCH,
  REPLICATION_DEBOUNCE,
  SearchedDoctype
} from '@/search/consts'
import { getPouchLink } from '@/search/helpers/client'
import { getSearchEncoder } from '@/search/helpers/getSearchEncoder'
import { normalizeSearchResult } from '@/search/helpers/normalizeSearchResult'
import { startReplicationWithDebounce } from '@/search/helpers/replication'
import {
  queryFilesForSearch,
  queryAllContacts,
  queryAllApps
} from '@/search/queries'
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
} from '@/search/types'

import { addFilePaths, shouldKeepFile } from './helpers/normalizeFile'

const log = Minilog('🗂️ [Indexing]')

interface FlexSearchResultWithDoctype
  extends FlexSearch.EnrichedDocumentSearchResultSetUnit<CozyDoc> {
  doctype: SearchedDoctype
}

class SearchEngine {
  client: CozyClient
  searchIndexes: SearchIndexes
  debouncedReplication: () => void

  constructor(client: CozyClient) {
    this.client = client
    this.searchIndexes = {} as SearchIndexes

    this.indexOnChanges()
    this.debouncedReplication = startReplicationWithDebounce(
      client,
      REPLICATION_DEBOUNCE
    )
  }

  indexOnChanges(): void {
    if (!this.client) {
      return
    }
    this.client.on('pouchlink:doctypesync:end', async (doctype: string) => {
      if (isSearchedDoctype(doctype)) {
        await this.indexDocsForSearch(doctype as keyof typeof SEARCH_SCHEMA)
      }
    })
    this.client.on('login', () => {
      // Ensure login is done before plugin register
      this.client.registerPlugin(RealtimePlugin, {})
      this.handleUpdatedOrCreatedDoc = this.handleUpdatedOrCreatedDoc.bind(this)
      this.handleDeletedDoc = this.handleDeletedDoc.bind(this)

      this.subscribeDoctype(this.client, FILES_DOCTYPE)
      this.subscribeDoctype(this.client, CONTACTS_DOCTYPE)
      this.subscribeDoctype(this.client, APPS_DOCTYPE)
    })
  }

  subscribeDoctype(client: CozyClient, doctype: string): void {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    const realtime = client.plugins.realtime
    realtime.subscribe('created', doctype, this.handleUpdatedOrCreatedDoc)
    realtime.subscribe('updated', doctype, this.handleUpdatedOrCreatedDoc)
    realtime.subscribe('deleted', doctype, this.handleDeletedDoc)
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
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
    log.debug('[REALTIME] index doc after update : ', doc)
    this.addDocToIndex(searchIndex.index, doc)

    this.debouncedReplication()
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
    log.debug('[REALTIME] remove doc from index after update : ', doc)
    this.searchIndexes[doctype].index.remove(doc._id!)

    this.debouncedReplication()
  }

  buildSearchIndex(
    doctype: keyof typeof SEARCH_SCHEMA,
    docs: CozyDoc[]
  ): FlexSearch.Document<CozyDoc, true> {
    const fieldsToIndex = SEARCH_SCHEMA[doctype]

    const flexsearchIndex = new FlexSearch.Document<CozyDoc, true>({
      tokenize: 'forward',
      encode: getSearchEncoder(),
      // @ts-ignore
      minlength: 2,
      document: {
        id: '_id',
        index: fieldsToIndex,
        store: true
      }
    })

    for (const doc of docs) {
      this.addDocToIndex(flexsearchIndex, doc)
    }

    return flexsearchIndex
  }

  addDocToIndex(
    flexsearchIndex: FlexSearch.Document<CozyDoc, true>,
    doc: CozyDoc
  ): void {
    if (this.shouldIndexDoc(doc)) {
      flexsearchIndex.add(doc)
    }
  }

  shouldIndexDoc(doc: CozyDoc): boolean {
    if (isIOCozyFile(doc)) {
      return shouldKeepFile(doc)
    }
    return true
  }

  async indexDocsForSearch(
    doctype: keyof typeof SEARCH_SCHEMA
  ): Promise<SearchIndex | null> {
    const searchIndex = this.searchIndexes[doctype]
    const pouchLink = getPouchLink(this.client)

    if (!pouchLink) {
      return null
    }

    if (!searchIndex) {
      // First creation of search index
      const startTimeQ = performance.now()
      const docs = await this.client.queryAll<CozyDoc[]>(
        Q(doctype).limitBy(null)
      )
      const endTimeQ = performance.now()
      log.debug(
        `Query ${docs.length} docs doctype ${doctype} took ${(endTimeQ - startTimeQ).toFixed(2)} ms`
      )

      const startTimeIndex = performance.now()
      const index = this.buildSearchIndex(doctype, docs)
      const endTimeIndex = performance.now()
      log.debug(
        `Create ${doctype} index took ${(endTimeIndex - startTimeIndex).toFixed(2)} ms`
      )
      const info = await pouchLink.getDbInfo(doctype)

      this.searchIndexes[doctype] = {
        index,
        lastSeq: info?.update_seq,
        lastUpdated: new Date().toISOString()
      }
      return this.searchIndexes[doctype]
    }

    // Incremental index update
    // At this point, the search index are supposed to be already up-to-date,
    // thanks to the realtime.
    // However, we check it is actually the case for safety, and update the lastSeq
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
        this.addDocToIndex(searchIndex.index, normalizedDoc)
      }
    }

    searchIndex.lastSeq = changes.last_seq
    searchIndex.lastUpdated = new Date().toISOString()
    return searchIndex
  }

  initIndexesFromStack = async (): Promise<SearchIndexes> => {
    log.debug('Initializing indexes')

    const files = await queryFilesForSearch(this.client)
    const filesIndex = this.buildSearchIndex('io.cozy.files', files)

    const contacts = await queryAllContacts(this.client)
    const contactsIndex = this.buildSearchIndex('io.cozy.contacts', contacts)

    const apps = await queryAllApps(this.client)
    const appsIndex = this.buildSearchIndex('io.cozy.apps', apps)

    log.debug('Finished initializing indexes')
    const currentDate = new Date().toISOString()
    this.searchIndexes = {
      [FILES_DOCTYPE]: {
        index: filesIndex,
        lastSeq: 0,
        lastUpdated: currentDate
      },
      [CONTACTS_DOCTYPE]: {
        index: contactsIndex,
        lastSeq: 0,
        lastUpdated: currentDate
      },
      [APPS_DOCTYPE]: { index: appsIndex, lastSeq: 0, lastUpdated: currentDate }
    }
    return this.searchIndexes
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
    const completedResults = addFilePaths(this.client, results)
    for (const res of completedResults) {
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

export default SearchEngine
