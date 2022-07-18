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
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { downloadFiles, forwardFile, makeZipFolder } from '../Actions/utils'
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
  const { allMultiSelectionFiles } = useMultiSelection()
  const { isMobile } = useBreakpoints()
  const [zipFolder, setZipFolder] = useState({ name: '', dirId: '' })
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false)
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)
  const [fileToForward, setFileToForward] = useState(null)

  const onFileCreate = async file => {
    if (
      file &&
      file.name === zipFolder.name &&
      file.dir_id === zipFolder.dirId
    ) {
      setIsBackdropOpen(false)
      setIsForwardModalOpen(true)
      setFileToForward(file)
    }
  }

  useRealtime(client, {
    [FILES_DOCTYPE]: {
      created: onFileCreate
    }
  })

  const download = async () => {
    await downloadFiles(client, allMultiSelectionFiles)
    onClose()
  }

  const forward = async () => {
    if (allMultiSelectionFiles.length === 1) {
      await forwardFile(client, allMultiSelectionFiles, t)
    } else {
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
        files: allMultiSelectionFiles,
        zipFolderName: defaultZipFolderName,
        dirId: parentFolderId
      })
      setZipFolder({ name: zipName, dirId: parentFolderId })
    }
  }

  const isDesktopOrMobileWithoutShareAPI =
    (isMobile && !navigator.share) || !isMobile

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

      {isDesktopOrMobileWithoutShareAPI && (
        <Button
          variant="secondary"
          label={t('action.zipDownload')}
          startIcon={<Icon icon="download" />}
          onClick={download}
          disabled={allMultiSelectionFiles.length === 0}
          data-testid="downloadButton"
        />
      )}

      {!isDesktopOrMobileWithoutShareAPI && (
        <Button
          variant="secondary"
          label={t('action.forward')}
          startIcon={<Icon icon="paperplane" />}
          onClick={forward}
          disabled={allMultiSelectionFiles.length === 0}
          data-testid="forwardButton"
        />
      )}

      {isForwardModalOpen && (
        <ForwardModal
          onClose={() => setIsForwardModalOpen(false)}
          onForward={onClose}
          fileToForward={fileToForward}
        />
      )}
    </>
  )
}

MultiselectViewActions.propTypes = {
  onClose: PropTypes.func
}

export default MultiselectViewActions
