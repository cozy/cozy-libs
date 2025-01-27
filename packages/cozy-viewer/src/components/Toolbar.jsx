import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import {
  OpenSharingLinkButton,
  useSharingInfos,
  useSharingContext,
  ShareButton
} from 'cozy-sharing'
import { download } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import Typography from 'cozy-ui/transpiled/react/Typography'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ToolbarFilePath } from './ToolbarFilePath'
import styles from './styles.styl'
import { extractChildrenCompByName } from '../Footer/helpers'
import { useShareModal } from '../providers/ShareModalProvider'
import { useViewer } from '../providers/ViewerProvider'

const Toolbar = ({
  hidden,
  onMouseEnter,
  onMouseLeave,
  onClose,
  toolbarRef,
  breakpoints: { isDesktop },
  children,
  showFilePath
}) => {
  const client = useClient()
  const { t } = useI18n()
  const webviewIntent = useWebviewIntent()
  const { file } = useViewer()
  const { isSharingShortcutCreated, addSharingLink, loading } =
    useSharingInfos()
  const { isOwner } = useSharingContext()
  const { setShowShareModal } = useShareModal()

  const isCozySharing = window.location.pathname === '/preview'
  const isShareNotAdded = !loading && !isSharingShortcutCreated
  const ToolbarButtons = extractChildrenCompByName({
    children,
    file,
    name: 'ToolbarButtons'
  })

  return (
    <div
      ref={toolbarRef}
      data-testid="viewer-toolbar"
      className={cx(styles['viewer-toolbar'], {
        [styles['viewer-toolbar--hidden']]: hidden
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {onClose && (
        <IconButton className={cx({ 'u-white': isDesktop })} onClick={onClose}>
          <Icon icon={PreviousIcon} />
        </IconButton>
      )}
      <div className="u-pl-half u-ov-auto u-w-100">
        <Typography
          variant={isDesktop ? 'h3' : 'h4'}
          color={isDesktop ? 'inherit' : 'textPrimary'}
          noWrap
        >
          <MidEllipsis text={file.name} />
        </Typography>
        {showFilePath ? <ToolbarFilePath /> : null}
      </div>

      {isDesktop && (
        <div className="u-flex u-flex-items-center">
          {!isCozySharing && !isOwner(file._id) && (
            <ShareButton
              className="u-white"
              fullWidth
              useShortLabel
              docId={file._id}
              onClick={() => setShowShareModal(true)}
            />
          )}
          {isCozySharing && isShareNotAdded && (
            <OpenSharingLinkButton
              link={addSharingLink}
              isSharingShortcutCreated={isSharingShortcutCreated}
              variant="text"
              className="u-white"
              color="default"
              isShortLabel
            />
          )}
          <Button
            className="u-white"
            variant="text"
            aria-label={t('Viewer.download')}
            label={t('Viewer.download')}
            startIcon={<Icon icon={DownloadIcon} />}
            onClick={() => download.action([file], { client, webviewIntent })}
          />
        </div>
      )}
      {ToolbarButtons}
    </div>
  )
}

Toolbar.propTypes = {
  hidden: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  showFilePath: PropTypes.bool
}

export default withBreakpoints()(Toolbar)
