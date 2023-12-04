import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useClient, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { FileImageLoader } from 'cozy-ui/transpiled/react/FileImageLoader'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { buildFileQueryById } from '../../helpers/queries'
import { forwardFile } from '../Actions/utils'

const styles = {
  image: {
    maxHeight: 64,
    maxWidth: 64
  }
}

const ForwardModal = ({ onClose, onForward, file }) => {
  const client = useClient()
  const { t } = useI18n()
  const { fileId } = useParams()
  const navigate = useNavigate()

  const buildedFilesQuery = buildFileQueryById(fileId, !!fileId)
  const { data } = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )
  const fileToForward = file || data

  if (!fileToForward) return null

  const onCloseForwardModal = () => (onClose ? onClose() : navigate('..'))

  const handleClick = async () => {
    await forwardFile(client, [fileToForward], t)
    onForward && onForward()
  }

  return (
    <ConfirmDialog
      open
      onClose={onCloseForwardModal}
      content={
        <>
          <div className="u-ta-center u-mb-1">
            <FileImageLoader
              client={client}
              file={fileToForward}
              linkType="tiny"
              render={src => {
                return src ? (
                  <img src={src} alt="" style={styles.image} />
                ) : (
                  <Skeleton variant="rect" animation="wave" />
                )
              }}
              renderFallback={() => <Icon icon="file-type-zip" size={64} />}
            />
            <Typography variant="h5" className="u-mv-1">
              {fileToForward.name}
            </Typography>
            <Typography>{t('ForwardModal.content')}</Typography>
          </div>
        </>
      }
      actions={
        <Button label={t('ForwardModal.action')} onClick={handleClick} />
      }
    />
  )
}

ForwardModal.propTypes = {
  onForward: PropTypes.func,
  onClose: PropTypes.func,
  file: PropTypes.object
}

export default ForwardModal
