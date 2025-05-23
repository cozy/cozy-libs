import { IOCozyFile } from 'cozy-client/types/types'

import { TYPE_DIRECTORY } from '../consts'
import { ROOT_DIR_ID, SHARED_DRIVES_DIR_ID } from '../consts'
import { CozyDoc } from '../types'

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

export const shouldKeepFile = (file: IOCozyFile): boolean => {
  const notInTrash = !file.trashed && !/^\/\.cozy_trash/.test(file.path ?? '')
  const notRootDir = file._id !== ROOT_DIR_ID
  // Shared drives folder to be hidden in search.
  // The files inside it though must appear. Thus only the file with the folder ID is filtered out.
  const notSharedDrivesDir = file._id !== SHARED_DRIVES_DIR_ID

  return notInTrash && notRootDir && notSharedDrivesDir
}
