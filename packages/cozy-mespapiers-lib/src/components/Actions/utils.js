// TODO Move to cozy-client (files model)

import { isReferencedBy } from 'cozy-client'
import { getDisplayName } from 'cozy-client/dist/models/contact'
import { getSharingLink } from 'cozy-client/dist/models/sharing'

import { FILES_DOCTYPE, JOBS_DOCTYPE } from '../../doctypes'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import getOrCreateAppFolderWithReference from '../../helpers/getFolderWithReference'
import { handleConflictFilename } from '../../utils/handleConflictFilename'
export const isAnyFileReferencedBy = (files, doctype) => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedBy(files[i], doctype)) return true
  }
  return false
}

const isMissingFileError = error => error.status === 404

const downloadFileError = error => {
  return isMissingFileError(error)
    ? 'common.downloadFile.error.missing'
    : 'common.downloadFile.error.offline'
}

/**
 * Create a zip folder with the list of files and save it in a desired folder in Drive
 * @param {object} param
 * @param {import('cozy-client/types/CozyClient').default} param.client - Instance of CozyClient
 * @param {import('cozy-client/types/types').IOCozyFile[]} param.files - List of files to zip
 * @param {string} param.zipFolderName - Desired name of the Zip folder
 * @param {string} param.dirId - Id of the destination folder of the zip
 * @returns {Promise<string>} - Final name of the zip folder
 */
export const createZipFolderJob = async ({
  client,
  files,
  zipFolderName,
  dirId
}) => {
  const filename = await handleConflictFilename(client, dirId, zipFolderName)
  const zipData = {
    files: Object.fromEntries(files.map(file => [file.name, file._id])),
    dir_id: dirId,
    filename
  }

  const jobCollection = client.collection(JOBS_DOCTYPE)
  await jobCollection.create('zip', zipData, {}, true)

  return filename
}

/**
 *
 * @param {object} param
 * @param {import('cozy-client/types/CozyClient').default} param.client - Instance of CozyClient
 * @param {import('cozy-client/types/types').IOCozyFile[]} param.docs - List of files to zip
 * @param {Function} param.t - i18n function
 * @param {Function} param.f - date formatting function
 * @returns
 */
export const makeZipFolder = async ({ client, docs, t, f }) => {
  const currentUser = await fetchCurrentUser(client)
  const defaultZipFolderName = t('Multiselect.folderZipName', {
    contactName: getDisplayName(currentUser),
    date: f(Date.now(), 'YYYY.MM.DD')
  })

  const { _id: parentFolderId } = await getOrCreateAppFolderWithReference(
    client,
    t
  )

  const zipName = await createZipFolderJob({
    client,
    files: docs,
    zipFolderName: defaultZipFolderName,
    dirId: parentFolderId
  })

  // Should we reject at some time here ?
  return new Promise(resolve => {
    client.plugins.realtime.subscribe('created', FILES_DOCTYPE, file => {
      if (file && file.name === zipName && file.dir_id === parentFolderId) {
        resolve(file)
      }
    })
  })
}

/**
 * forwardFile - Triggers the download of one or multiple files by the browser
 * @param {object} options
 * @param {import('cozy-client/types/CozyClient').default} options.client
 * @param {import('cozy-client/types/types').IOCozyFile[]} options.files One or more files to download
 * @param {Function} options.t i18n function
 * @param {string} options.ttl Time to live of the sharing link
 * @param {string} options.password Password of the sharing link
 * @param {Function} options.showAlert - Function to display an alert
 */
export const forwardFile = async ({
  client,
  files,
  t,
  ttl,
  password,
  showAlert
}) => {
  try {
    // We currently support only one file at a time
    const file = files[0]
    const url = await getSharingLink(client, [file._id], { ttl, password })
    const isZipFile = file.class === 'zip'
    const shareData = {
      title: t('viewer.shareData.title', {
        name: file.name,
        smart_count: isZipFile ? 2 : 1
      }),
      text: t('viewer.shareData.text', {
        name: file.name,
        smart_count: isZipFile ? 2 : 1
      }),
      url
    }
    navigator.share(shareData)
  } catch (error) {
    showAlert({
      message: t('viewer.shareData.error'),
      severity: 'error',
      variant: 'filled'
    })
  }
}

/**
 * downloadFiles - Triggers the download of one or multiple files by the browser
 *
 * @param {object} options
 * @param {import('cozy-client/types/CozyClient').default} options.client
 * @param {import('cozy-client/types/types').IOCozyFile[]} options.files One or more files to download
 * @param {Function} options.showAlert - Function to display an alert
 * @param {Function} options.t i18n function
 */
export const downloadFiles = async ({ client, files, showAlert, t }) => {
  const fileCollection = client.collection(FILES_DOCTYPE)
  if (files.length === 1) {
    const file = files[0]

    try {
      const filename = file.name
      const downloadURL = await fileCollection.getDownloadLinkById(
        file.id,
        filename
      )

      fileCollection.forceFileDownload(`${downloadURL}?Dl=1`, filename)
    } catch (error) {
      showAlert({
        message: t(downloadFileError(error)),
        severity: 'error',
        variant: 'filled'
      })
    }
  } else {
    const ids = files.map(f => f.id)
    const href = await fileCollection.getArchiveLinkByIds(ids)
    const fullpath = `${client.getStackClient().uri}${href}`
    fileCollection.forceFileDownload(fullpath, 'files.zip')
  }
}

const isAlreadyInTrash = err => {
  const reasons = err.reason !== undefined ? err.reason.errors : undefined
  if (reasons) {
    for (const reason of reasons) {
      if (reason.detail === 'File or directory is already in the trash') {
        return true
      }
    }
  }
  return false
}

/**
 * trashFiles - Moves a set of files to the cozy trash
 *
 * @param {object} options
 * @param {import('cozy-client/types/CozyClient').default} options.client
 * @param {import('cozy-client/types/types').IOCozyFile[]} options.files  One or more files to trash
 * @param {Function} options.showAlert - Function to display an alert
 * @param {Function} options.t i18n function
 */
export const trashFiles = async ({ client, files, showAlert, t }) => {
  try {
    for (const file of files) {
      await client.destroy(file)
    }

    showAlert({
      message: t('common.trashFile.success'),
      severity: 'success',
      variant: 'filled'
    })
  } catch (err) {
    if (!isAlreadyInTrash(err)) {
      showAlert({
        message: t('common.trashFile.error'),
        severity: 'error',
        variant: 'filled'
      })
    }
  }
}

/**
 * removeQualification - Remove qualification attribute
 *
 * @param {object} options
 * @param {import('cozy-client/types/CozyClient').default} options.client
 * @param {import('cozy-client/types/types').IOCozyFile[]} options.files  One or more files to remove qualification
 * @param {Function} options.showAlert - Function to display an alert
 * @param {Function} options.t i18n function
 */
export const removeQualification = async ({ client, files, showAlert, t }) => {
  try {
    const fileCollection = client.collection(FILES_DOCTYPE)
    for (const file of files) {
      await fileCollection.updateMetadataAttribute(file._id, {
        qualification: undefined
      })
    }

    showAlert({
      message: t('common.removeQualification.success'),
      severity: 'success',
      variant: 'filled'
    })
  } catch (err) {
    showAlert({
      message: t('common.removeQualification.error'),
      severity: 'error',
      variant: 'filled'
    })
  }
}
