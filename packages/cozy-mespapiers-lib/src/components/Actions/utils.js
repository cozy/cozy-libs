// TODO Move to cozy-client (files model)

import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { isReferencedBy } from 'cozy-client'

import { FILES_DOCTYPE } from '../../doctypes'
import { getSharingLink } from '../../utils/getSharingLink'

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
    const shareData = {
      title: t('viewer.shareData.title', { name: file.name }),
      text: t('viewer.shareData.text', { name: file.name }),
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
