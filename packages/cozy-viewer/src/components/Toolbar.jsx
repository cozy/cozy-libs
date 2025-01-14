import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import { downloadFile } from 'cozy-client/dist/models/file'
import { useWebviewIntent } from 'cozy-intent'
import {
  openSharingLink,
  OpenSharingLinkButton,
  useSharingInfos
} from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import Typography from 'cozy-ui/transpiled/react/Typography'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { useEncrypted } from 'cozy-ui/transpiled/react/providers/Encrypted'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import PrintButton from './PrintButton'
import PublicToolbarMoreMenu from './PublicToolbarMoreMenu'
import { ToolbarFilePath } from './ToolbarFilePath'
import styles from './styles.styl'
import { extractChildrenCompByName } from '../Footer/helpers'

const useClasses = makeStyles(theme => ({
  iconButton: {
    [theme.breakpoints.down('md')]: {
      marginLeft: '0.25rem'
    }
  }
}))

const Toolbar = ({
  hidden,
  onMouseEnter,
  onMouseLeave,
  file,
  onClose,
  toolbarRef,
  breakpoints: { isDesktop },
  children,
  showFilePath
}) => {
  const client = useClient()
  const classes = useClasses()
  const { t } = useI18n()
  const webviewIntent = useWebviewIntent()
  const { isSharingShortcutCreated, discoveryLink, loading } = useSharingInfos()
  const isCozySharing = window.location.pathname === '/preview'
  const isShareNotAdded = !loading && !isSharingShortcutCreated

  const { url } = useEncrypted()

  const ToolbarButtons = extractChildrenCompByName({
    children,
    file,
    name: 'ToolbarButtons'
  })

  const actions = makeActions([openSharingLink], {
    isSharingShortcutCreated,
    link: discoveryLink,
    openSharingLinkDisplayed: isCozySharing
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
        <IconButton
          className={cx(classes.iconButton, { 'u-white': isDesktop })}
          onClick={onClose}
        >
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
        {showFilePath ? <ToolbarFilePath file={file} /> : null}
      </div>

      {isDesktop && (
        <div className="u-flex u-flex-items-center">
          {ToolbarButtons}
          {isCozySharing && isShareNotAdded && (
            <OpenSharingLinkButton
              link={discoveryLink}
              isSharingShortcutCreated={isSharingShortcutCreated}
              variant="text"
              className="u-white"
              color="default"
              isShortLabel
            />
          )}
          <PrintButton file={file} />
          <IconButton
            className="u-white"
            aria-label={t('Viewer.download')}
            onClick={() => downloadFile({ client, file, url, webviewIntent })}
          >
            <Icon icon={DownloadIcon} />
          </IconButton>
          {isCozySharing && (
            <PublicToolbarMoreMenu files={[file]} actions={actions} />
          )}
        </div>
      )}
    </div>
  )
}

Toolbar.propTypes = {
  hidden: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  showFilePath: PropTypes.bool
}

export default withBreakpoints()(Toolbar)
