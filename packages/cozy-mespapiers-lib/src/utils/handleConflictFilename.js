import { models } from 'cozy-client'

import { FILES_DOCTYPE } from '../doctypes'

const {
  file: { getFullpath, splitFilename, generateNewFileNameOnConflict }
} = models

export const handleConflictFilename = async (client, appFolderID, name) => {
  try {
    const path = await getFullpath(client, appFolderID, name)
    await client.collection(FILES_DOCTYPE).statByPath(path)

    const { filename, extension } = splitFilename({
      name,
      type: 'file'
    })
    const newFilename = generateNewFileNameOnConflict(filename) + extension

    return handleConflictFilename(client, appFolderID, newFilename)
  } catch (error) {
    if (/Not Found/.test(error.message)) {
      return name
    }
  }
}
