import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useClient, models } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import useRealtime from 'cozy-realtime/dist/useRealtime'

import { downloadFiles, forwardFile, makeZipFolder } from '../Actions/utils'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { FILES_DOCTYPE } from '../../doctypes'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import getOrCreateAppFolderWithReference from '../../helpers/getFolderWithReference'

const { getDisplayName } = models.contact

const MultiselectViewActions = ({ onClose }) => {
  const { t, f } = useI18n()
  const client = useClient()
  const { multiSelectionFiles } = useMultiSelection()
  const [zipFolder, setZipFolder] = useState({ name: '', dirId: '' })

  const onFileCreate = async file => {
    if (
      file &&
      file.name === zipFolder.name &&
      file.dir_id === zipFolder.dirId
    ) {
      await forwardFile(client, [file], t)
    }
    onClose()
  }

  useRealtime(client, {
    [FILES_DOCTYPE]: {
      created: onFileCreate
    }
  })

  const download = async () => {
    await downloadFiles(client, multiSelectionFiles)
    onClose()
  }

  const forward = async () => {
    const currentUser = await fetchCurrentUser(client)
    const defaultZipFolderName = t('Multiselect.folderZipName', {
      contactName: getDisplayName(currentUser),
      date: f(Date.now(), 'YYYY.MM.DD')
    })

    const { _id: parentFolderId } = await getOrCreateAppFolderWithReference(
      client,
      t
    )

    const zipName = await makeZipFolder({
      client,
      files: multiSelectionFiles,
      zipFolderName: defaultZipFolderName,
      dirId: parentFolderId
    })
    setZipFolder({ name: zipName, dirId: parentFolderId })
  }

  return (
    <>
      <Button
        variant="secondary"
        label={t('action.download')}
        onClick={download}
        disabled={multiSelectionFiles.length === 0}
      />
      {navigator.share && (
        <Button
          variant="secondary"
          label={t('action.forward')}
          onClick={forward}
          disabled={multiSelectionFiles.length === 0}
        />
      )}
    </>
  )
}

MultiselectViewActions.propTypes = {
  onClose: PropTypes.func
}

export default MultiselectViewActions
