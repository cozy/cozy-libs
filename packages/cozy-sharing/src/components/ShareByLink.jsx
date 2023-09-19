import copy from 'copy-text-to-clipboard'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback } from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CopyIcon from 'cozy-ui/transpiled/react/Icons/Copy'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import EditLinkPermissionDialog from './EditLinkPermissionDialog'
import { isOnlyReadOnlyLinkAllowed } from '../helpers/link'
import logger from '../logger'

const ShareByLink = ({ link, document, documentType, onEnable }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const [loading, setLoading] = useState(false)
  const [shouldCopyToClipboard, setShouldCopyToClipboard] = useState(false)
  const [alert, setAlert] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const copyLinkToClipboard = useCallback(
    ({ isAutomaticCopy }) => {
      if (copy(link)) {
        setAlert({
          open: true,
          severity: 'success',
          message: t(`${documentType}.share.shareByLink.copied`)
        })
      } else if (!isAutomaticCopy) {
        // In case of automatic copy, the browser can block the copy request. This is not shown to the user since it is expected and can be circumvented by clicking directly on the copy link
        setAlert({
          open: true,
          severity: 'error',
          message: t(`${documentType}.share.shareByLink.failed`)
        })
      }
    },
    [documentType, link, t]
  )

  const onPermissionsSelected = async options => {
    try {
      setLoading(true)
      await onEnable(document, options)
    } catch (e) {
      setAlert({
        open: true,
        severity: 'error',
        message: t(`${documentType}.share.error.generic`)
      })
      logger.log(e)
    } finally {
      setLoading(false)
      setShouldCopyToClipboard(true)
    }
  }

  const onCreate = async () => {
    if (isOnlyReadOnlyLinkAllowed({ documentType })) {
      onPermissionsSelected({ verbs: ['GET'] })
    } else {
      setIsEditDialogOpen(true)
    }
  }

  useEffect(() => {
    if (link && shouldCopyToClipboard) {
      copyLinkToClipboard({ isAutomaticCopy: true })
      setShouldCopyToClipboard(false)
    }
  }, [link, shouldCopyToClipboard, copyLinkToClipboard])

  const onClose = () => {
    setIsEditDialogOpen(false)
  }

  const onCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  const showCopyAndSendButtons = link && isMobile && navigator.share
  const showOnlyCopyButton =
    (link && !isMobile) || (link && isMobile && !navigator.share)

  const shareLink = async () => {
    try {
      const shareData = {
        text: t(`${documentType}.share.shareByLink.shareDescription`, {
          name: document.name || ''
        }),
        url: link
      }
      await navigator.share(shareData)
    } catch (error) {
      setAlert({
        open: true,
        severity: 'error',
        message: t(`${documentType}.share.error.generic`)
      })
    }
  }

  return (
    <div className="u-w-100 u-flex u-flex-justify-center">
      {!link && (
        <Button
          label={t(`${documentType}.share.shareByLink.create`)}
          variant="secondary"
          size="medium"
          startIcon={<Icon icon={LinkIcon} />}
          className="u-flex-auto"
          busy={loading}
          style={{ position: 'initial' }} // fix z-index bug on iOS when under a BottomDrawer due to relative position
          onClick={onCreate}
        />
      )}
      {showCopyAndSendButtons && (
        <>
          <Button
            label={t(`${documentType}.share.shareByLink.send`)}
            variant="secondary"
            size="medium"
            startIcon={<Icon icon={LinkIcon} />}
            className="u-flex-auto u-mr-half"
            onClick={shareLink}
          />
          <Button
            label={<Icon icon={CopyIcon} />}
            variant="secondary"
            size="medium"
            onClick={copyLinkToClipboard}
          />
        </>
      )}
      {showOnlyCopyButton && (
        <Button
          label={t(`${documentType}.share.shareByLink.copy`)}
          variant="secondary"
          size="medium"
          startIcon={<Icon icon={LinkIcon} />}
          className="u-flex-auto u-mr-half"
          onClick={copyLinkToClipboard}
        />
      )}
      {isEditDialogOpen && (
        <EditLinkPermissionDialog
          open
          onClose={onClose}
          document={document}
          onPermissionsSelected={onPermissionsSelected}
        />
      )}
      <Snackbar open={alert.open} onClose={onCloseAlert}>
        <Alert
          variant="filled"
          severity={alert.severity}
          onClose={onCloseAlert}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

ShareByLink.propTypes = {
  link: PropTypes.string,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  onEnable: PropTypes.func.isRequired
}

export default ShareByLink
