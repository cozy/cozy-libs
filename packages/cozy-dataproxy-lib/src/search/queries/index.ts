import CozyClient, { Q } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import { TYPE_DIRECTORY } from '../consts'
import {
  normalizeFileWithFolders,
  shouldKeepFile
} from '../helpers/normalizeFile'
import { CozyDoc } from '../types'

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
  return client.queryAll<CozyDoc[]>(Q(doctype).limitBy(null))
}

export const queryDocById = async (
  client: CozyClient,
  doctype: string,
  id: string
): Promise<CozyDoc> => {
  const resp = (await client.query(Q(doctype).getById(id), {
    singleDocData: true
  })) as QueryResponseSingleDoc
  return resp.data
}
