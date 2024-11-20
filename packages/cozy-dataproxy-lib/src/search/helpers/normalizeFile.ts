import CozyClient from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import {
  FILES_DOCTYPE,
  TYPE_DIRECTORY,
  TYPE_FILE,
  ROOT_DIR_ID,
  SHARED_DRIVES_DIR_ID
} from '../consts'
import { queryDocById } from '../queries'
import { CozyDoc, isIOCozyFile } from '../types'

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

export const addFilePaths = (docs: CozyDoc[]): CozyDoc[] => {
  const completedDocs = [...docs]
  const filesAndDirs = completedDocs.filter(doc => isIOCozyFile(doc))

  if (filesAndDirs.length > 0) {
    const directoryPaths = new Map<string, string>()

    filesAndDirs.forEach(file => {
      if (file.type === TYPE_DIRECTORY) {
        // Get all directory paths
        directoryPaths.set(file._id, file.path || '')
      }
    })

    return filesAndDirs.map(file => {
      if (file.type === TYPE_FILE) {
        const parentPath = directoryPaths.get(file.dir_id) || ''
        // Add path to all files based on their parent path
        return {
          ...file,
          path: parentPath ? `${parentPath}/${file.name}` : ''
        }
      }
      return file
    })
  }
  return completedDocs
}

export const shouldKeepFile = (file: IOCozyFile): boolean => {
  const notInTrash = !file.trashed && !/^\/\.cozy_trash/.test(file.path ?? '')
  const notRootDir = file._id !== ROOT_DIR_ID
  // Shared drives folder to be hidden in search.
  // The files inside it though must appear. Thus only the file with the folder ID is filtered out.
  const notSharedDrivesDir = file._id !== SHARED_DRIVES_DIR_ID

  return notInTrash && notRootDir && notSharedDrivesDir
}

export const computeFileFullpath = async (
  client: CozyClient,
  file: IOCozyFile
): Promise<IOCozyFile> => {
  if (file.type === TYPE_DIRECTORY) {
    // No need to compute directory path: it is always here
    return file
  }
  if (file.path) {
    // If a file path exists, check it is complete, i.e. it includes the name.
    // The stack typically does not include the name in the path, which is useful to search on it
    if (file.path?.includes(file.name)) {
      return file
    }
    const newPath = `${file.path}/${file.name}`
    return { ...file, path: newPath }
  }
  // If there is no path at all, let's compute it from the parent path
  const fileWithPath = { ...file }
  const parentDir = (await queryDocById(
    client,
    FILES_DOCTYPE,
    file.dir_id
  )) as IOCozyFile

  if (parentDir) {
    const path = `${parentDir.path}/${file.name}`
    fileWithPath.path = path
  }
  return fileWithPath
}
