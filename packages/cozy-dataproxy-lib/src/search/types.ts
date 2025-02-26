import FlexSearch from 'flexsearch'

import { IOCozyFile, IOCozyContact, IOCozyApp } from 'cozy-client/types/types'

import {
  APPS_DOCTYPE,
  CONTACTS_DOCTYPE,
  FILES_DOCTYPE,
  SEARCH_SCHEMA,
  SearchedDoctype
} from './consts'

export type CozyDoc = IOCozyFile | IOCozyContact | IOCozyApp

export const isIOCozyFile = (doc: CozyDoc): doc is IOCozyFile => {
  return doc._type === FILES_DOCTYPE
}

export const isIOCozyContact = (doc: CozyDoc): doc is IOCozyContact => {
  return doc._type === CONTACTS_DOCTYPE
}

export const isIOCozyApp = (doc: CozyDoc): doc is IOCozyApp => {
  return doc._type === APPS_DOCTYPE
}

const searchedDoctypes = Object.keys(SEARCH_SCHEMA)

export const isSearchedDoctype = (
  doctype: string | undefined
): doctype is SearchedDoctype => {
  if (!doctype) {
    return false
  }
  return searchedDoctypes.includes(doctype)
}

export interface SearchOptions {
  doctypes: string[] // Specify which doctypes should be searched, and their order
}

export interface RawSearchResult {
  fields: string[]
  doctype: SearchedDoctype
  id: string
}

export interface EnrichedSearchResult extends RawSearchResult {
  doc: CozyDoc
}

export interface SearchResult {
  doc: IOCozyFile | IOCozyApp | IOCozyContact
  slug: string | null
  title: string | null
  subTitle: string | null
  url: string | null
  secondaryUrl: string | null
}

export interface SearchIndex {
  index: FlexSearch.Document<CozyDoc, false>
  lastSeq: number | null
  lastUpdated: string | null
}

export type SearchIndexes = {
  [key in SearchedDoctype]: SearchIndex
}

export interface StorageInterface {
  storeData(key: string, value: unknown): Promise<void>
  getData<T>(key: string): Promise<T | null>
}
