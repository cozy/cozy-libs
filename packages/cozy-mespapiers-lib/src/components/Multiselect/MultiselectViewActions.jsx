import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import useRealtime from 'cozy-realtime/dist/useRealtime'
import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import { LinearProgress } from 'cozy-ui/transpiled/react/Progress'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import ForwardModal from './ForwardModal'
import { FILES_DOCTYPE } from '../../doctypes'
import { useFileSharing } from '../Contexts/FileSharingProvider'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import useActions from '../SearchResult/useActions'

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
  const { t } = useI18n()
  const client = useClient()
  const classes = useStyles()
  const { allMultiSelectionFiles } = useMultiSelection()
  const [zipFolder, setZipFolder] = useState({ name: '', dirId: '' })
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)
  const [fileToForward, setFileToForward] = useState(null)

  const { isFileSharingAvailable, shareFiles } = useFileSharing()

  const onFileCreate = async file => {
    if (
      file &&
      file.name === zipFolder.name &&
      file.dir_id === zipFolder.dirId
    ) {
      setIsBackdropOpen(false)
      setFileToForward(file)
    }
  }

  useRealtime(client, {
    [FILES_DOCTYPE]: {
      created: onFileCreate
    }
  })

  const handleCloseForwardModal = () => {
    setFileToForward(null)
  }

  const actions = useActions(allMultiSelectionFiles, {
    isActionBar: true,
    actionsOptions: {
      setFileToForward,
      setIsBackdropOpen,
      setZipFolder,
      isFileSharingAvailable,
      shareFiles
    }
  })

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

      <ActionsBar actions={actions} docs={allMultiSelectionFiles} />

      {!!fileToForward && (
        <ForwardModal
          onClose={handleCloseForwardModal}
          onForward={onClose}
          file={fileToForward}
        />
      )}
    </>
  )
}

MultiselectViewActions.propTypes = {
  onClose: PropTypes.func
}

export default MultiselectViewActions
