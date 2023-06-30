// TODO Move to cozy-client (files model)

import { isReferencedBy } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import { download, forward } from './Items'
import { FILES_DOCTYPE, JOBS_DOCTYPE } from '../../doctypes'
import { getSharingLink } from '../../utils/getSharingLink'
import { handleConflictFilename } from '../../utils/handleConflictFilename'

export const makeActionVariant = () => {
  return navigator.share ? [forward, download] : [download]
}

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
 * @typedef {object} MakeZipFolderParam
 * @property {CozyClient} client - Instance of CozyClient
 * @property {IOCozyFile[]} files - List of files to zip
 * @property {string} zipFolderName - Desired name of the Zip folder
 * @property {string} dirId - Id of the destination folder of the zip
 */

/**
 * Create a zip folder with the list of files and save it in a desired folder in Drive
 *
 * @param {MakeZipFolderParam} param0
 * @returns {Promise<string>} - Final name of the zip folder
 */
export const makeZipFolder = async ({
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
 * forwardFile - Triggers the download of one or multiple files by the browser
 * @param {CozyClient} client
 * @param {array} files One or more files to download
 * @param {func} t i18n function
 */
export const forwardFile = async (client, files, t) => {
  try {
    // We currently support only one file at a time
    const file = files[0]
    const url = await getSharingLink(client, file, true)
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
    Alerter.error('viewer.shareData.error', { error: error })
  }
}

/**
 * downloadFiles - Triggers the download of one or multiple files by the browser
 *
 * @param {CozyClient} client
 * @param {array} files One or more files to download
 */
export const downloadFiles = async (client, files) => {
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
      Alerter.error(downloadFileError(error))
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
 * @param {CozyClient} client
 * @param {array} files  One or more files to trash
 */
export const trashFiles = async (client, files) => {
  try {
    for (const file of files) {
      await client.destroy(file)
    }

    Alerter.success('common.trashFile.success')
  } catch (err) {
    if (!isAlreadyInTrash(err)) {
      Alerter.error('common.trashFile.error')
    }
  }
}

/**
 * removeQualification - Remove qualification attribute
 *
 * @param {CozyClient} client
 * @param {array} files  One or more files
 */
export const removeQualification = async (client, files) => {
  try {
    const fileCollection = client.collection(FILES_DOCTYPE)
    for (const file of files) {
      await fileCollection.updateMetadataAttribute(file._id, {
        qualification: undefined
      })
    }

    Alerter.success('common.removeQualification.success')
  } catch (err) {
    Alerter.error('common.removeQualification.error')
  }
}
