import CozyClient from 'cozy-client'

import { FILES_DOCTYPE, TYPE_DIRECTORY, TYPE_FILE } from '../consts'
import { queryDocById } from '../queries'
import { IOCozyFile } from '../types'
import { CozyDoc, isIOCozyFile } from '../types'

/**
 * The paths are not stored in CouchDB for files, thus there are not in PouchDB neither.
 * Thus, we keep all the file paths in memory to be able to quickly retrieve them
 * at search time.
 */
const allPaths = new Map<string, string>()

export const getFilePath = (id: string): string | undefined => {
  return id ? allPaths.get(id) : undefined
}

const setFilePath = (id: string, path: string): void => {
  allPaths.set(id, path)
}

export const resetAllPaths = (): void => {
  allPaths.clear()
}

/**
 * Compute and set paths for given files.
 *
 * The paths are kept in memory to be quickly retrieved later.
 * From a list of io.cozy.files, we first extract the directories paths.
 * Then, for each file, we compute the path from its parent.
 *
 * @param {CozyDoc[]} docs - The list of docs to compute paths
 * @returns {CozyDoc[]} the list of docs with paths
 */
export const setFilePaths = (docs: CozyDoc[]): CozyDoc[] => {
  const completedDocs = [...docs]
  const filesAndDirs = completedDocs.filter(doc => isIOCozyFile(doc))

  if (filesAndDirs.length > 0) {
    filesAndDirs.forEach(file => {
      if (file.type === TYPE_DIRECTORY) {
        // Get all directory paths
        setFilePath(file._id, file.path || '')
      }
    })

    return filesAndDirs.map(file => {
      if (file.type === TYPE_FILE) {
        const parentPath = getFilePath(file.dir_id)
        // Add path to all files based on their parent path
        const path = parentPath ? `${parentPath}/${file.name}` : ''
        setFilePath(file._id, path)
        return {
          ...file,
          path: path
        }
      }
      return file
    })
  }
  return completedDocs
}

/**
 * Compute paths for files
 *
 * There are several ways to get a path:
 *   - It is already defined in the file
 *   - The file path exists in memory
 *   - The directory path exists in memory
 *   - The directory path is retrieved from db
 *
 * @param { CozyClient} client - The cozy client instance
 * @param { IOCozyFile} file - The file to compute path
 * @returns {Promise<IOCozyFile>} the completed file with path
 */
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
      setFilePath(file._id, file.path)
      return file
    }
    const newPath = `${file.path}/${file.name}`
    setFilePath(file._id, newPath)
    return { ...file, path: newPath }
  }

  const filePath = getFilePath(file._id)
  if (filePath) {
    // File path exists in memory
    return { ...file, path: filePath }
  }

  const parentPath = getFilePath(file.dir_id)
  if (parentPath) {
    // Parent path exists in memory
    const path = `${parentPath}/${file.name}`
    setFilePath(file._id, path) // Add the path in memory
    return { ...file, path }
  }

  // If there is no path found at all, let's compute it from the parent path in database
  const fileWithPath = { ...file }
  const parentDir = (await queryDocById(
    client,
    FILES_DOCTYPE,
    file.dir_id
  )) as IOCozyFile

  if (parentDir?.path) {
    const path = `${parentDir.path}/${file.name}`
    fileWithPath.path = path
    // Add the paths in memory
    setFilePath(file.dir_id, parentDir.path)
    setFilePath(file._id, path)
  }
  return fileWithPath
}
