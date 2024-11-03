import CozyClient, { Q } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import { CONTACTS_DOCTYPE, APPS_DOCTYPE, TYPE_DIRECTORY } from '@/search/consts'
import {
  normalizeFileWithFolders,
  shouldKeepFile
} from '@/search/helpers/normalizeFile'
import { CozyDoc } from '@/search/types'

interface DBRow {
  id: string
  doc: IOCozyFile
}

interface AllDocsResponse {
  rows: DBRow[]
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
  const files = resp.rows.map(row => ({ id: row.id, ...row.doc }) as IOCozyFile)
  const folders = files.filter(file => file.type === TYPE_DIRECTORY)

  const filteredFiles = files.filter(file => shouldKeepFile(file))
  const normalizedFiles = filteredFiles.map(file =>
    normalizeFileWithFolders(folders, file)
  )

  return normalizedFiles
}

export const queryAllContacts = (client: CozyClient): Promise<CozyDoc[]> => {
  return client.queryAll(Q(CONTACTS_DOCTYPE).limitBy(1000))
}

export const queryAllApps = (client: CozyClient): Promise<CozyDoc[]> => {
  return client.queryAll(Q(APPS_DOCTYPE).limitBy(1000))
}
