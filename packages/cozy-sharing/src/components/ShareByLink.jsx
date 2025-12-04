import PropTypes from 'prop-types'
import React, { useReducer } from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CopyIcon from 'cozy-ui/transpiled/react/Icons/Copy'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { ShareRestrictionModal } from './ShareRestrictionModal/ShareRestrictionModal'
import { copyToClipboard } from './ShareRestrictionModal/helpers'

const ShareByLink = ({ link, document, documentType }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { showAlert } = useAlert()

  const showCopyAndSendButtons = link && isMobile && navigator.share
  const showOnlyCopyButton =
    (link && !isMobile) || (link && isMobile && !navigator.share)

  const [isEditDialogOpen, toggleEditDialogOpen] = useReducer(
    state => !state,
    false
  )

  const copyLinkToClipboard = async () => {
    await copyToClipboard(link, { t, showAlert })
  }

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
      showAlert({
        message: t(`${documentType}.share.error.generic`),
        severity: 'error',
        variant: 'filled'
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
          style={{ position: 'initial' }} // fix z-index bug on iOS when under a BottomDrawer due to relative position
          onClick={toggleEditDialogOpen}
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
        <ShareRestrictionModal file={document} onClose={toggleEditDialogOpen} />
      )}
    </div>
  )
}

ShareByLink.propTypes = {
  link: PropTypes.string,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired
}

export default ShareByLink
