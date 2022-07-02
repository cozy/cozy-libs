import { models } from 'cozy-client'

import { APPS_DOCTYPE } from '../doctypes'

const { MAGIC_FOLDERS, ensureMagicFolder, getReferencedFolder } = models.folder

const APP_DIR_REF = `${APPS_DOCTYPE}/mypapers`

const getOrCreateAppFolderWithReference = async (client, t) => {
  const existingFolders = await getReferencedFolder(client, {
    _id: APP_DIR_REF,
    _type: APPS_DOCTYPE
  })

  if (existingFolders) {
    return existingFolders
  } else {
    const { path: administrativeFolderPath } = await ensureMagicFolder(
      client,
      MAGIC_FOLDERS.ADMINISTRATIVE,
      `/${t('folder.administrative')}`
    )

    const appFolder = await ensureMagicFolder(
      client,
      MAGIC_FOLDERS.PAPERS,
      `${administrativeFolderPath}/${t('folder.papers')}`
    )

    return appFolder
  }
}

export default getOrCreateAppFolderWithReference
