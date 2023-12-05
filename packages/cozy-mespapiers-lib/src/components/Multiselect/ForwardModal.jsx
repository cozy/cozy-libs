import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useClient, useQuery } from 'cozy-client'
import { getSharingLink } from 'cozy-client/dist/models/sharing'
import { isMobile } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { FileImageLoader } from 'cozy-ui/transpiled/react/FileImageLoader'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { copyToClipboard } from '../../helpers/copyToClipboard'
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
  const { showAlert } = useAlert()
  const { fileId } = useParams()
  const navigate = useNavigate()
  const modalContentRef = useRef(null)

  const buildedFilesQuery = buildFileQueryById(fileId, !!fileId)
  const { data } = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )
  const fileToForward = file || data
  const isDesktopOrMobileWithoutShareAPI =
    (isMobile() && !navigator.share) || !isMobile()

  if (!fileToForward) return null

  // The .zip is made from 2 or more files, we need this distinction for pluralization
  const isMultipleFile = fileToForward.mime === 'application/zip' ? 2 : 1
  const onCloseForwardModal = () => (onClose ? onClose() : navigate('..'))

  const handleClick = async () => {
    if (isDesktopOrMobileWithoutShareAPI) {
      const url = await getSharingLink(client, [fileToForward._id])
      copyToClipboard(url, { target: modalContentRef.current, t, showAlert })
      onCloseForwardModal()
    } else {
      await forwardFile(client, [fileToForward], t)
      onForward?.()
    }
  }

  const textContent = isDesktopOrMobileWithoutShareAPI
    ? t('ForwardModal.content.desktop', {
        smart_count: isMultipleFile
      })
    : t('ForwardModal.content.mobile', {
        smart_count: isMultipleFile
      })
  const textAction = isDesktopOrMobileWithoutShareAPI
    ? t('ForwardModal.action.desktop')
    : t('ForwardModal.action.mobile')

  return (
    <ConfirmDialog
      open
      onClose={onCloseForwardModal}
      content={
        <>
          <div className="u-ta-center u-mb-1" ref={modalContentRef}>
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
            <Typography>{textContent}</Typography>
          </div>
        </>
      }
      actions={<Button label={textAction} onClick={handleClick} />}
    />
  )
}

ForwardModal.propTypes = {
  onForward: PropTypes.func,
  onClose: PropTypes.func,
  file: PropTypes.object
}

export default ForwardModal
