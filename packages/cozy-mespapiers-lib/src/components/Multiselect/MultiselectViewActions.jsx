import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useClient, models } from 'cozy-client'
import useRealtime from 'cozy-realtime/dist/useRealtime'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { LinearProgress } from 'cozy-ui/transpiled/react/Progress'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'

import { downloadFiles, makeZipFolder } from '../Actions/utils'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { FILES_DOCTYPE } from '../../doctypes'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import getOrCreateAppFolderWithReference from '../../helpers/getFolderWithReference'
import ForwardModal from './ForwardModal'

const { getDisplayName } = models.contact

const useStyles = makeStyles(theme => ({
  backdropRoot: {
    zIndex: 'var(--zIndex-modal)'
  },
  barText: {
    color: 'var(--primaryContrastTextColor)'
  },
  bar: {
    borderRadius: theme.shape.borderRadius
  },
  barBackgroundColorPrimary: {
    backgroundColor: 'var(--secondaryTextColor)'
  },
  barBackgroundActiveColorPrimary: {
    backgroundColor: 'var(--primaryContrastTextColor)'
  }
}))

const MultiselectViewActions = ({ onClose }) => {
  const { t, f } = useI18n()
  const client = useClient()
  const classes = useStyles()
  const { multiSelectionFiles } = useMultiSelection()
  const [zipFolder, setZipFolder] = useState({ name: '', dirId: '' })
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)

  const onFileCreate = async file => {
    if (
      file &&
      file.name === zipFolder.name &&
      file.dir_id === zipFolder.dirId
    ) {
      setIsBackdropOpen(false)
      setIsTransferModalOpen(true)
    }
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
    setIsBackdropOpen(true)

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
      <Backdrop classes={{ root: classes.backdropRoot }} open={isBackdropOpen}>
        <div className="u-w-100 u-mh-2 u-ta-center">
          <Typography classes={{ root: classes.barText }} className="u-mb-1">
            {t('Multiselect.backdrop')}
          </Typography>
          <LinearProgress
            classes={{
              root: classes.bar,
              colorPrimary: classes.barBackgroundColorPrimary,
              barColorPrimary: classes.barBackgroundActiveColorPrimary
            }}
          />
        </div>
      </Backdrop>

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

      {isTransferModalOpen && (
        <ForwardModal
          onClose={() => setIsTransferModalOpen(false)}
          onForward={onClose}
        />
      )}
    </>
  )
}

MultiselectViewActions.propTypes = {
  onClose: PropTypes.func
}

export default MultiselectViewActions
