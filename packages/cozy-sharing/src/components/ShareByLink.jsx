import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-text-to-clipboard'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import CopyIcon from 'cozy-ui/transpiled/react/Icons/Copy'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import EditLinkPermissionDialog from './EditLinkPermissionDialog'
import logger from '../logger'

const ShareByLink = ({
  link,
  documentType,
  document,
  permissions,
  onChangePermissions,
  onEnable,
  checked
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const [loading, setLoading] = useState(false)
  const [shouldCopyToClipboard, setShouldCopyToClipboard] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const copyLinkToClipboard = useCallback(
    ({ isAutomaticCopy }) => {
      if (copy(link))
        Alerter.success(t(`${documentType}.share.shareByLink.copied`))
      else if (!isAutomaticCopy)
        // In case of automatic copy, the browser can block the copy request. This is not shown to the user since it is expected and can be circumvented by clicking directly on the copy link
        Alerter.error(t(`${documentType}.share.shareByLink.failed`))
    },
    [documentType, link, t]
  )

  const createShareLink = async () => {
    try {
      setLoading(true)
      await onEnable(document)
    } catch (e) {
      Alerter.error(t(`${documentType}.share.error.generic`))
      logger.log(e)
    } finally {
      setLoading(false)
    }
  }

  const onCreate = async () => {
    await createShareLink()
    setIsEditDialogOpen(true)
    setShouldCopyToClipboard(true)
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

  return (
    <div className="u-w-100 u-flex u-flex-justify-center">
      {!checked && (
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
      {checked && isMobile && (
        <>
          <Button
            label={t(`${documentType}.share.shareByLink.send`)}
            variant="secondary"
            size="medium"
            startIcon={<Icon icon={LinkIcon} />}
            className="u-flex-auto u-mr-half"
          />
          <Button
            label={<Icon icon={CopyIcon} />}
            variant="secondary"
            size="medium"
            onClick={copyLinkToClipboard}
          />
        </>
      )}
      {checked && !isMobile && (
        <Button
          label={t(`${documentType}.share.shareByLink.copy`)}
          variant="secondary"
          size="medium"
          startIcon={<Icon icon={LinkIcon} />}
          className="u-flex-auto u-mr-half"
          onClick={copyLinkToClipboard}
        />
      )}
      {isEditDialogOpen && checked && (
        <EditLinkPermissionDialog
          open
          onClose={onClose}
          document={document}
          documentType={documentType}
          permissions={permissions}
          onChangePermissions={onChangePermissions}
        />
      )}
    </div>
  )
}

ShareByLink.propTypes = {
  permissions: PropTypes.array.isRequired,
  checked: PropTypes.bool.isRequired,
  documentType: PropTypes.string.isRequired,
  document: PropTypes.object.isRequired,
  link: PropTypes.string,
  onEnable: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired
}

export default ShareByLink
