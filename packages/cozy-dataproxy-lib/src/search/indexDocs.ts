import FlexSearch from 'flexsearch'

import CozyClient from 'cozy-client'

import { SearchEngine } from './SearchEngine'
import { SEARCH_SCHEMA } from './consts'
import { getPouchLink } from './helpers/client'
import { setFilePaths, computeFileFullpath } from './helpers/filePaths'
import { getSearchEncoder } from './helpers/getSearchEncoder'
import { shouldKeepApp } from './helpers/normalizeApp'
import { shouldKeepFile } from './helpers/normalizeFile'
import { queryLocalOrRemoteDocs } from './queries'
import { CozyDoc, isIOCozyFile, isIOCozyApp, SearchIndex } from './types'

export const initSearchIndex = (
  doctype: keyof typeof SEARCH_SCHEMA
): FlexSearch.Document<CozyDoc, false> => {
  const fieldsToIndex = SEARCH_SCHEMA[doctype]

  const flexsearchIndex = new FlexSearch.Document<CozyDoc, false>({
    tokenize: 'reverse', // See https://github.com/nextapps-de/flexsearch?tab=readme-ov-file#tokenizer
    encode: getSearchEncoder(),
    // @ts-expect-error minlength is not described by Flexsearch types but exists
    minlength: 3,
    document: {
      id: '_id',
      index: fieldsToIndex,
      store: false // Use redux store to get docs
    }
  })
  return flexsearchIndex
}

export const indexAllDocs = (
  flexsearchIndex: FlexSearch.Document<CozyDoc, false>,
  docs: CozyDoc[],
  isLocalSearch: boolean
): FlexSearch.Document<CozyDoc, false> => {
  for (const doc of docs) {
    if (shouldIndexDoc(doc)) {
      flexsearchIndex.add(doc)
    } else {
      // Should not index doc: remove it from index if it exists
      flexsearchIndex.remove(doc._id!)
    }
  }
  if (isLocalSearch) {
    setFilePaths(docs) // Necessary to keep track of local file paths
  }
  return flexsearchIndex
}

export const indexSingleDoc = async (
  client: CozyClient,
  flexsearchIndex: FlexSearch.Document<CozyDoc, false>,
  doc: CozyDoc
): Promise<void> => {
  if (shouldIndexDoc(doc)) {
    let docToIndex = doc
    if (isIOCozyFile(doc)) {
      // Add path for files
      docToIndex = await computeFileFullpath(client, doc)
    }
    flexsearchIndex.add(docToIndex)
  } else {
    // Should not index doc: remove it from index if it exists
    flexsearchIndex.remove(doc._id!)
  }
}

export const indexOnChanges = async (
  searchEngine: SearchEngine,
  searchIndex: SearchIndex,
  doctype: string
): Promise<SearchIndex> => {
  const pouchLink = getPouchLink(searchEngine.client)
  if (!searchEngine.isLocalSearch || !pouchLink) {
    // No need to handle incremental indexation for non-local search:
    // it is already done through realtime
    return searchIndex
  }
  const lastSeq = searchIndex?.lastSeq || 0
  const changes = await pouchLink.getChanges(doctype, {
    include_docs: true,
    since: lastSeq
  })

  for (const change of changes.results) {
    if (change.deleted) {
      searchIndex.index.remove(change.id)
    } else {
      const normalizedDoc = { ...change.doc, _type: doctype } as CozyDoc
      await indexSingleDoc(
        searchEngine.client,
        searchIndex.index,
        normalizedDoc
      )
    }
  }

  searchIndex.lastSeq = changes.last_seq
  searchIndex.lastUpdated = new Date().toISOString()
  return searchIndex
}

export const initDoctypeAfterIndexImport = async (
  client: CozyClient,
  doctype: string
): Promise<void> => {
  // Query the local database to load documents in store
  const docs = await queryLocalOrRemoteDocs(client, doctype, {
    isLocalSearch: true
  })
  // If we are here, the data is locally queried. And paths are not stored in db, so
  // we need to compute file paths from files docs
  setFilePaths(docs)
}

const shouldIndexDoc = (doc: CozyDoc): boolean => {
  if (isIOCozyFile(doc)) {
    return shouldKeepFile(doc)
  }
  if (isIOCozyApp(doc)) {
    return shouldKeepApp(doc)
  }
  return true
}
