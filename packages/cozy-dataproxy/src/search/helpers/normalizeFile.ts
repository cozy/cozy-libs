import CozyClient from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import {
  FILES_DOCTYPE,
  TYPE_DIRECTORY,
  TYPE_FILE,
  ROOT_DIR_ID,
  SHARED_DRIVES_DIR_ID
} from '../consts'
import { CozyDoc, isIOCozyFile, RawSearchResult } from '../types'

/**
 * Normalize file for Front usage in <AutoSuggestion> component inside <BarSearchAutosuggest>
 *
 * To reduce API call, the fetching of Note URL has been delayed
 * inside an onSelect function called only if provided to <BarSearchAutosuggest>
 * see https://github.com/cozy/cozy-drive/pull/2663#discussion_r938671963
 *
 * @param {[IOCozyFile]} folders - all the folders returned by API
 * @param {IOCozyFile} file - file to normalize
 * @returns file with normalized field to be used in AutoSuggestion
 */
export const normalizeFileWithFolders = (
  folders: IOCozyFile[],
  file: IOCozyFile
): CozyDoc => {
  const isDir = file.type === TYPE_DIRECTORY
  let path = ''
  if (isDir) {
    path = file.path ?? ''
  } else {
    const parentDir = folders.find(folder => folder._id === file.dir_id)
    path = parentDir && parentDir.path ? parentDir.path : ''
  }
  return { ...file, _type: 'io.cozy.files', path }
}

export const addFilePaths = (
  client: CozyClient,
  results: RawSearchResult[]
): RawSearchResult[] => {
  const normResults = [...results]
  const filesResults = normResults
    .map(res => res.doc)
    .filter(doc => isIOCozyFile(doc))
  const files = filesResults.filter(file => file.type === TYPE_FILE)

  if (files.length > 0) {
    const dirIds = files.map(file => file.dir_id)
    const parentDirs = getDirsFromStore(client, dirIds)
    for (const file of files) {
      const dir = parentDirs.find(dir => dir._id === file.dir_id)
      if (dir) {
        const idx = normResults.findIndex(res => res.doc._id === file._id)
        // @ts-expect-error We know that we are manipulating an IOCozyFile here so path exists
        normResults[idx].doc.path = dir.path
      }
    }
  }
  return normResults
}

const getDirsFromStore = (
  client: CozyClient,
  dirIds: string[]
): IOCozyFile[] => {
  // XXX querying from store is surprisingly slow: 100+ ms for 50 docs, while
  // this approach takes 2-3ms... It should be investigated in cozy-client
  const allFiles = client.getCollectionFromState(FILES_DOCTYPE) as IOCozyFile[]
  const dirs = allFiles.filter(file => file.type === TYPE_DIRECTORY)
  return dirs.filter(dir => dirIds.includes(dir._id))
}

export const shouldKeepFile = (file: IOCozyFile): boolean => {
  const notInTrash = !file.trashed && !/^\/\.cozy_trash/.test(file.path ?? '')
  const notRootDir = file._id !== ROOT_DIR_ID
  // Shared drives folder to be hidden in search.
  // The files inside it though must appear. Thus only the file with the folder ID is filtered out.
  const notSharedDrivesDir = file._id !== SHARED_DRIVES_DIR_ID

  return notInTrash && notRootDir && notSharedDrivesDir
}
