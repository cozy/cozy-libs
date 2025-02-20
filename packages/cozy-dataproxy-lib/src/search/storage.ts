import Minilog from 'cozy-minilog'

import {
  DATAPROXY_STORAGE_PREFIX,
  MIN_DELAY_BEFORE_EXPORT,
  SEARCH_SCHEMA,
  SEARCHABLE_DOCTYPES,
  SearchedDoctype
} from './consts'
import { initSearchIndex } from './indexDocs'
import { CozyDoc, SearchIndex, SearchIndexes, StorageInterface } from './types'

const log = Minilog('🗂️ [Index storage]')

const EXPORT_DATE_KEY = 'searchExportDate'
const INDEX_KEYS = 'searchIndexKeys'
const LAST_SEQ_KEY = 'searchIndexLastSeq'
const LAST_UPDATED_KEY = 'searchIndexLastUpdated'

const buildStorageKey = (doctype: string, key: string): string => {
  return `${DATAPROXY_STORAGE_PREFIX}:${doctype}:${key}`
}

export const persistExportDate = async (
  storage: StorageInterface
): Promise<void> => {
  const date = new Date().toISOString()
  await storage?.storeData(
    `${DATAPROXY_STORAGE_PREFIX}:${EXPORT_DATE_KEY}`,
    date
  )
}

export const getExportDate = async (
  storage: StorageInterface
): Promise<string | null> => {
  return storage?.getData<string>(
    `${DATAPROXY_STORAGE_PREFIX}:${EXPORT_DATE_KEY}`
  )
}

export const exportSearchIndexes = async (
  storage: StorageInterface,
  searchIndexes: SearchIndexes
): Promise<void> => {
  if (!storage) {
    return
  }

  const lastExportDate = await getExportDate(storage)
  if (lastExportDate) {
    // Prevent too frequent exports
    if (
      new Date(lastExportDate).getTime() + MIN_DELAY_BEFORE_EXPORT >
      new Date().getTime()
    ) {
      log.info('Export already happened earlier, skip it.')
      return
    }
  }

  log.info('Start indexes export')

  for (const key of Object.keys(searchIndexes)) {
    const doctype = key as SearchedDoctype
    const searchIndex = searchIndexes[doctype]
    const keys: string[] = []

    await searchIndex.index.export((key: string | number, data: unknown) => {
      // do the saving as async
      keys.push(key as string)
      const value = JSON.stringify(data)
      if (value) {
        void storage.storeData(buildStorageKey(doctype, key as string), data)
      }
      return
    })

    await storage.storeData(buildStorageKey(doctype, INDEX_KEYS), keys)
    await storage.storeData(
      buildStorageKey(doctype, LAST_SEQ_KEY),
      searchIndex.lastSeq
    )
    await storage.storeData(
      buildStorageKey(doctype, LAST_UPDATED_KEY),
      searchIndex.lastUpdated
    )
  }
  await persistExportDate(storage)
  log.info('Indexes export done')
}

export const importSearchIndexes = async (
  storage: StorageInterface
): Promise<SearchIndexes> => {
  log.info('Start indexes import')

  const searchIndexes = {} as SearchIndexes
  if (!storage) {
    return searchIndexes
  }

  for (const doctype of SEARCHABLE_DOCTYPES) {
    const index = initSearchIndex(doctype as keyof typeof SEARCH_SCHEMA)
    const startImportDoctype = performance.now()

    const keys = await storage.getData<string[]>(
      buildStorageKey(doctype, INDEX_KEYS)
    )
    if (!keys) {
      log.warn(`No keys available to import index ${doctype}`)
      continue
    }

    for (const key of keys) {
      const data = await storage.getData<CozyDoc>(buildStorageKey(doctype, key))
      if (data) {
        await index.import(key, data)
      }
    }
    const lastSeq = await storage.getData<number>(
      buildStorageKey(doctype, LAST_SEQ_KEY)
    )
    const lastUpdated = await storage.getData<string>(
      buildStorageKey(doctype, LAST_UPDATED_KEY)
    )
    const searchIndex: SearchIndex = {
      index,
      lastSeq,
      lastUpdated
    }
    searchIndexes[doctype] = searchIndex

    const endImportDoctype = performance.now()

    log.debug(
      `${doctype} import took ${(endImportDoctype - startImportDoctype).toFixed(
        2
      )} ms`
    )
  }
  return searchIndexes
}
