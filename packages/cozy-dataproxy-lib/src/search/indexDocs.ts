import FlexSearch from 'flexsearch'

import CozyClient from 'cozy-client'

import { SearchEngine } from './SearchEngine'
import { SEARCH_SCHEMA } from './consts'
import { getPouchLink } from './helpers/client'
import { getSearchEncoder } from './helpers/getSearchEncoder'
import { shouldKeepApp } from './helpers/normalizeApp'
import { shouldKeepFile } from './helpers/normalizeFile'
import { normalizeDoctype } from './helpers/utils'
import { queryLocalOrRemoteDocs } from './queries'
import { CozyDoc, isIOCozyFile, isIOCozyApp, SearchIndex } from './types'

export const initSearchIndex = (
  doctype: string
): FlexSearch.Document<CozyDoc, false> => {
  const fieldsToIndex = SEARCH_SCHEMA[normalizeDoctype(doctype)]

  const flexsearchIndex = new FlexSearch.Document<CozyDoc, false>({
    tokenize: 'reverse', // See https://github.com/nextapps-de/flexsearch?tab=readme-ov-file#tokenizer
    encode: getSearchEncoder(),
    // @ts-expect-error minlength is not described by Flexsearch types but exists
    minlength: 2,
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
  docs: CozyDoc[]
): FlexSearch.Document<CozyDoc, false> => {
  for (const doc of docs) {
    if (shouldIndexDoc(doc)) {
      flexsearchIndex.add(doc)
    } else {
      // Should not index doc: remove it from index if it exists
      flexsearchIndex.remove(doc._id!)
    }
  }

  return flexsearchIndex
}

export const indexSingleDoc = (
  flexsearchIndex: FlexSearch.Document<CozyDoc, false>,
  doc: CozyDoc
): void => {
  if (shouldIndexDoc(doc)) {
    flexsearchIndex.add(doc)
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
      indexSingleDoc(searchIndex.index, normalizedDoc)
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
  // Query all files to load documents and compute paths
  await queryLocalOrRemoteDocs(client, doctype, {
    isLocalSearch: true
  })
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
