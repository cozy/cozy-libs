import CozyClient, { generateWebLink, models } from 'cozy-client'
import { IOCozyContact } from 'cozy-client/types/types'
import Minilog from 'cozy-minilog'

import { APPS_DOCTYPE, TYPE_DIRECTORY, TYPE_FILE } from '../consts'
import { queryDocsByIds } from '../queries'
import {
  CozyDoc,
  RawSearchResult,
  isIOCozyApp,
  isIOCozyContact,
  isIOCozyFile,
  isIOCozySharedDriveFile,
  SearchResult,
  EnrichedSearchResult
} from '../types'
import { isDebug } from './utils'

const log = Minilog('🗂️ [Indexing]')

export const normalizeSearchResult = (
  client: CozyClient,
  searchResults: EnrichedSearchResult,
  query: string
): SearchResult => {
  const doc = getCleanedFilePath(searchResults.doc)
  const slug = getSearchResultSlug(client, doc)
  const url = buildOpenURL(client, doc, slug)
  const secondaryUrl = buildSecondaryURL(client, doc, url)
  const title = getSearchResultTitle(doc)
  const subTitle = getSearchResultSubTitle(client, {
    fields: searchResults.fields,
    doc,
    query
  })
  const normalizedRes = { doc, slug, title, subTitle, url, secondaryUrl }

  return normalizedRes
}

export const getCleanedFilePath = (doc: CozyDoc): CozyDoc => {
  if (!isIOCozyFile(doc)) {
    return doc
  }
  const path = doc.path
  if (!path) {
    // Paths should be completed for both files and directories, at indexing time
    log.warn(`No path found for ${doc._id}}`)
    return doc
  }
  let newPath = path
  if (path.endsWith(`/${doc.name}`)) {
    // Remove the name from the path, which is added at indexing time to search on it
    newPath = path.slice(0, -doc.name.length - 1)
  }
  if (!newPath) {
    // Special case for root path
    newPath = '/'
  }

  return { ...doc, path: newPath }
}

const getSearchResultTitle = (doc: CozyDoc): string | null => {
  if (isIOCozyFile(doc)) {
    return doc.name
  }

  if (isIOCozyContact(doc)) {
    return doc.displayName || doc.fullname || null
  }

  if (isIOCozyApp(doc)) {
    return doc.name
  }

  return null
}

const getSearchResultSubTitle = (
  client: CozyClient,
  params: { fields: string[]; doc: CozyDoc; query: string }
): string | null => {
  const { fields, doc, query } = params
  if (isIOCozyFile(doc)) {
    return doc.path ?? null
  }

  if (isIOCozyContact(doc)) {
    let matchingValue

    // Several document fields might match a search query. Let's take the first one different from name, assuming a relevance order
    const matchingField = fields.find(
      field => field !== 'displayName' && field !== 'fullname'
    )

    if (!matchingField) {
      return null
    }

    if (matchingField.includes('[]:')) {
      const tokens = matchingField.split('[]:')
      if (tokens.length !== 2) {
        return null
      }
      const arrayAttributeName = tokens[0] as keyof IOCozyContact
      const valueAttribute = tokens[1]

      const array = doc[arrayAttributeName]
      const matchingArrayItem =
        Array.isArray(array) &&
        array.find(item => {
          const value =
            typeof item === 'object' &&
            item !== null &&
            valueAttribute in item &&
            item[valueAttribute as keyof typeof item]

          return typeof value === 'string' && value.includes(query)
        })

      if (!matchingArrayItem) {
        return null
      }
      matchingValue =
        matchingArrayItem[valueAttribute as keyof typeof matchingArrayItem]
    } else {
      matchingValue = doc[matchingField as keyof IOCozyContact]
    }

    return matchingValue?.toString() ?? null
  }

  if (doc._type === APPS_DOCTYPE) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const locale: string = client.getInstanceOptions().locale || 'en'
      if (doc.locales[locale]) {
        return doc.locales[locale].short_description
      }
    } catch {
      return doc.name
    }
  }
  return null
}

const getSearchResultSlug = (
  client: CozyClient,
  doc: CozyDoc
): string | null => {
  if (isIOCozyFile(doc)) {
    if (models.file.isNote(doc)) {
      const cozyUrl = client.getStackClient().uri
      const createdOn = doc.cozyMetadata?.createdOn
      const isSharedNote = createdOn && createdOn !== `${cozyUrl}/`
      // In case of a shared note, the cozyURL must be the one from the instance who the created it,
      // and should include the docID coming from this instance.
      // As we do not have this info, we need to first open the note on Drive, which will handle it
      // and make the correct redirection.
      return isSharedNote ? 'drive' : 'notes'
    }
    return 'drive'
  }

  if (isIOCozyContact(doc)) {
    return 'contacts'
  }

  if (isIOCozyApp(doc)) {
    return doc.slug
  }

  return null
}

const buildOpenURL = (
  client: CozyClient,
  doc: CozyDoc,
  slug: string | null
): string | null => {
  // TODO: extract some of this common logic with Drive  in cozy-client
  let urlHash = ''
  if (isIOCozyFile(doc)) {
    const isDir = doc.type === TYPE_DIRECTORY
    const dirId = isDir ? doc._id : doc.dir_id
    const folderURLHash = `/folder/${dirId}`

    if (models.file.isNote(doc)) {
      // A note might be opened by Drive if it is shared
      urlHash = slug === 'notes' ? `/n/${doc._id}` : `/note/${doc._id}`
    } else if (models.file.shouldBeOpenedByOnlyOffice(doc)) {
      urlHash = `/onlyoffice/${doc._id}?redirectLink=drive${folderURLHash}`
    } else if (isDir) {
      urlHash = folderURLHash
    } else {
      urlHash = `${folderURLHash}/file/${doc._id}`
    }
    if (isIOCozySharedDriveFile(doc)) {
      urlHash = `/shareddrive/${doc.driveId}/${dirId}`
      if (doc.type === TYPE_FILE) {
        urlHash += `/file/${doc._id}`
      }
    }
  }

  if (isIOCozyContact(doc)) {
    urlHash = `/${doc._id}`
  }

  if (!slug) {
    return null
  }

  return generateWebLink({
    cozyUrl: client.getStackClient().uri,
    slug,
    subDomainType: client.getInstanceOptions().subdomain,
    hash: urlHash,
    pathname: '',
    searchParams: []
  })
}

const buildSecondaryURL = (
  client: CozyClient,
  doc: CozyDoc,
  url: string | null
): string | null => {
  if (!isIOCozyFile(doc) || !url) {
    return null
  }

  let folderURLHash = `/folder/${doc.dir_id}`

  if (isIOCozySharedDriveFile(doc)) {
    folderURLHash = `/shareddrive/${doc.driveId}/${doc.dir_id}` // FIXME this url hash for shared drives should be in cozy-client
  }

  return generateWebLink({
    cozyUrl: client.getStackClient().uri,
    slug: 'drive',
    subDomainType: client.getInstanceOptions().subdomain,
    hash: folderURLHash,
    pathname: '',
    searchParams: []
  })
}

export const enrichResultsWithDocs = async (
  client: CozyClient,
  results: RawSearchResult[]
): Promise<EnrichedSearchResult[]> => {
  const enrichedResults = [...results] as EnrichedSearchResult[]

  // Group by doctype
  const resultsByDoctype = results.reduce<Record<string, string[]>>(
    (acc, { id, doctype }) => {
      if (!acc[doctype]) {
        acc[doctype] = []
      }
      acc[doctype].push(id)
      return acc
    },
    {}
  )
  let docs = [] as CozyDoc[]
  for (const doctype of Object.keys(resultsByDoctype)) {
    const ids = resultsByDoctype[doctype]

    const startQuery = performance.now()
    const fromStore = false
    // We used to query from store as it was much more efficient, but now we query directly from PouchDB
    // which should be fast enough after performances improvements in cozy-pouch-link
    const queryDocs = await queryDocsByIds(client, doctype, ids, {
      fromStore: false
    })

    const endQuery = performance.now()
    docs = docs.concat(queryDocs)
    if (isDebug()) {
      log.debug(
        `Query took ${(endQuery - startQuery).toFixed(2)} ms to retrieve ${
          ids.length
        } ${doctype} from store: ${fromStore}`
      )
    }
  }
  const docsMap = new Map(docs?.map(doc => [doc._id, doc]))

  const filteredResults = []
  for (const res of enrichedResults) {
    const id = res.id?.toString() // Because of flexsearch Id typing
    const doc = docsMap.get(id)
    if (!doc) {
      // TODO: remove missing docs from search index
      log.error(`${id} is found in search but not in local data`)
    } else {
      res.doc = doc
      filteredResults.push(res)
    }
  }
  return filteredResults
}
