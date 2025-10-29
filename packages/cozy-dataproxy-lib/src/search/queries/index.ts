import CozyClient, { Q, fetchPolicies } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import Minilog from 'cozy-minilog'

import { FILES_DOCTYPE, TYPE_DIRECTORY } from '../consts'
import {
  normalizeFileWithFolders,
  shouldKeepFile
} from '../helpers/normalizeFile'
import { isDebug } from '../helpers/utils'
import { CozyDoc } from '../types'

const log = Minilog('🗂️ [Indexing]')

interface DBRow {
  id: string
  doc: IOCozyFile
}

interface AllDocsResponse {
  rows: DBRow[]
}

interface QueryResponseSingleDoc {
  data: CozyDoc
}

interface QueryResponseMultipleDoc {
  data: CozyDoc[]
}

const defaultFetchPolicy = fetchPolicies.olderThan(5 * 60 * 1000) // 5 min

export const queryFilesForSearch = async (
  client: CozyClient
): Promise<CozyDoc[]> => {
  const resp: AllDocsResponse = await client
    .getStackClient()
    .fetchJSON(
      'GET',
      '/data/io.cozy.files/_all_docs?Fields=_id,trashed,dir_id,name,path,type,mime,class,metadata.title,metadata.version&DesignDocs=false&include_docs=true'
    )
  const files = resp.rows.map(row => ({ id: row.id, ...row.doc } as IOCozyFile))
  const folders = files.filter(file => file.type === TYPE_DIRECTORY)

  const filteredFiles = files.filter(file => shouldKeepFile(file))
  const normalizedFiles = filteredFiles.map(file =>
    normalizeFileWithFolders(folders, file)
  )

  return normalizedFiles
}

export const queryAllDocs = async (
  client: CozyClient,
  doctype: string
): Promise<CozyDoc[]> => {
  const queryOpts = {
    as: `${doctype}/all`,
    fetchPolicies: defaultFetchPolicy
  }
  return client.queryAll<CozyDoc[]>(Q(doctype).limitBy(null), queryOpts)
}

export const queryDocById = async (
  client: CozyClient,
  doctype: string,
  id: string
): Promise<CozyDoc> => {
  const queryOpts = {
    as: `${doctype}/${id}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
  const resp = (await client.query(
    Q(doctype).getById(id),
    queryOpts
  )) as QueryResponseSingleDoc
  return resp.data
}

export const queryDocsByIds = async (
  client: CozyClient,
  doctype: string,
  ids: string[],
  { fromStore = false } = {}
): Promise<CozyDoc[]> => {
  if (fromStore) {
    // This used to be more efficient than querying by id, but should be fixed now
    // See https://github.com/cozy/cozy-client/issues/1591
    const allDocs = client.getCollectionFromState(doctype)
    const docs = allDocs.filter(doc => doc._id && ids.includes(doc._id))
    return docs as CozyDoc[]
  }

  const resp = (await client.query(
    Q(doctype).getByIds(ids)
  )) as QueryResponseMultipleDoc
  return resp.data
}

export const queryLocalOrRemoteDocs = async (
  client: CozyClient,
  doctype: string,
  { isLocalSearch }: { isLocalSearch: boolean }
): Promise<CozyDoc[]> => {
  let docs = []
  const startTimeQ = performance.now()

  if (!isLocalSearch && doctype === FILES_DOCTYPE) {
    // Special case for stack's files
    docs = await queryFilesForSearch(client)
  } else {
    docs = await queryAllDocs(client, doctype)
  }
  const endTimeQ = performance.now()
  if (isDebug()) {
    log.debug(
      `Query ${docs.length} ${doctype} took ${(endTimeQ - startTimeQ).toFixed(
        2
      )} ms`
    )
  }
  return docs
}
