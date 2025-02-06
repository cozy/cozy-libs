import FlexSearch from 'flexsearch'

import CozyClient from 'cozy-client'

import { SearchEngine } from './SearchEngine'
import { SEARCH_SCHEMA } from './consts'
import { getPouchLink } from './helpers/client'
import { getSearchEncoder } from './helpers/getSearchEncoder'
import {
  addFilePaths,
  computeFileFullpath,
  shouldKeepFile
} from './helpers/normalizeFile'
import { CozyDoc, isIOCozyFile, SearchIndex } from './types'

export const initSearchIndex = (
  doctype: keyof typeof SEARCH_SCHEMA
): FlexSearch.Document<CozyDoc, true> => {
  const fieldsToIndex = SEARCH_SCHEMA[doctype]

  const flexsearchIndex = new FlexSearch.Document<CozyDoc, true>({
    tokenize: 'reverse', // See https://github.com/nextapps-de/flexsearch?tab=readme-ov-file#tokenizer
    encode: getSearchEncoder(),
    // @ts-expect-error minlength is not described by Flexsearch types but exists
    minlength: 3,
    document: {
      id: '_id',
      index: fieldsToIndex,
      store: true
    }
  })
  return flexsearchIndex
}

export const indexAllDocs = (
  flexsearchIndex: FlexSearch.Document<CozyDoc, true>,
  docs: CozyDoc[],
  isLocalSearch: boolean
): FlexSearch.Document<CozyDoc, true> => {
  // There is no persisted path for files: we must add it
  const completedDocs = isLocalSearch ? addFilePaths(docs) : docs
  for (const doc of completedDocs) {
    if (shouldIndexDoc(doc)) {
      flexsearchIndex.add(doc)
    } else {
      // Should not index doc: remove it from index if it exists
      flexsearchIndex.remove(doc._id!)
    }
  }
  return flexsearchIndex
}

export const indexSingleDoc = async (
  client: CozyClient,
  flexsearchIndex: FlexSearch.Document<CozyDoc, true>,
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
      void indexSingleDoc(searchEngine.client, searchIndex.index, normalizedDoc)
    }
  }

  searchIndex.lastSeq = changes.last_seq
  searchIndex.lastUpdated = new Date().toISOString()
  return searchIndex
}

const shouldIndexDoc = (doc: CozyDoc): boolean => {
  if (isIOCozyFile(doc)) {
    return shouldKeepFile(doc)
  }
  return true
}
