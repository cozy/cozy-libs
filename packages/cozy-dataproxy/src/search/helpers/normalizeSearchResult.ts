import CozyClient, { generateWebLink, models } from 'cozy-client'
import { IOCozyContact } from 'cozy-client/types/types'

import { APPS_DOCTYPE, TYPE_DIRECTORY } from '@/search/consts'
import {
  CozyDoc,
  RawSearchResult,
  isIOCozyApp,
  isIOCozyContact,
  isIOCozyFile,
  SearchResult
} from '@/search/types'

import { normalizeFileWithStore } from './normalizeFile'

export const normalizeSearchResult = async (
  client: CozyClient,
  searchResults: RawSearchResult,
  query: string
): Promise<SearchResult> => {
  const doc = await normalizeDoc(client, searchResults.doc)
  const url = buildOpenURL(client, doc)
  const type = getSearchResultSlug(doc)
  const title = getSearchResultTitle(doc)
  const name = getSearchResultSubTitle(client, {
    fields: searchResults.fields,
    doc,
    query
  })
  const normalizedRes = { doc, type, title, name, url }

  return normalizedRes
}

const normalizeDoc = async (
  client: CozyClient,
  doc: CozyDoc
): Promise<CozyDoc> => {
  if (isIOCozyFile(doc)) {
    return normalizeFileWithStore(client, doc)
  }
  return doc
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

const getSearchResultSlug = (doc: CozyDoc): string | null => {
  if (isIOCozyFile(doc)) {
    if (models.file.isNote(doc)) {
      return 'notes'
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

const buildOpenURL = (client: CozyClient, doc: CozyDoc): string | null => {
  let urlHash = ''
  const slug = getSearchResultSlug(doc)

  if (isIOCozyFile(doc)) {
    const isDir = doc.type === TYPE_DIRECTORY
    const dirId = isDir ? doc._id : doc.dir_id
    const folderURLHash = `/folder/${dirId}`

    if (models.file.isNote(doc)) {
      urlHash = `/n/${doc._id}`
    } else if (models.file.shouldBeOpenedByOnlyOffice(doc)) {
      // Ex: https://paultranvan-drive.mycozy.cloud/#/onlyoffice/cf82c604-3e2c-c656-741c-624c328d3404?redirectLink=drive%23%2Ffolder%2Fd2af6f38733f7efd68130804beefbc15
      // TODO: extract in cozy-client
      urlHash = `/onlyoffice/${doc._id}?redirectLink=drive${folderURLHash}`
    } else if (isDir) {
      urlHash = folderURLHash
    } else {
      urlHash = `${folderURLHash}/file/${doc._id}`
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
    // @ts-ignore
    subDomainType: client.getInstanceOptions().subdomain,
    hash: urlHash,
    pathname: '',
    searchParams: []
  })
}
