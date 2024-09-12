import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import { downloadFile } from 'cozy-client/dist/models/file'
import { useWebviewIntent } from 'cozy-intent'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import Typography from 'cozy-ui/transpiled/react/Typography'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import PrintButton from './PrintButton'
import { ToolbarFilePath } from './ToolbarFilePath'
import styles from './styles.styl'
import { extractChildrenCompByName } from '../Footer/helpers'
import { useEncrypted } from '../providers/EncryptedProvider'

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

  const { url } = useEncrypted()

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
        <IconButton
          className={cx(classes.iconButton, { 'u-white': isDesktop })}
          onClick={onClose}
        >
          <Icon icon={PreviousIcon} />
        </IconButton>
      )}
      <div className="u-pl-half u-ov-auto u-w-100">
        <Typography
          variant="h3"
          color={isDesktop ? 'inherit' : 'textPrimary'}
          noWrap
        >
          <MidEllipsis text={file.name} />
        </Typography>
        {showFilePath ? <ToolbarFilePath file={file} /> : null}
      </div>

      <div className="u-flex">
        {isDesktop && (
          <>
            {ToolbarButtons}
            <PrintButton file={file} />
            <IconButton
              className="u-white"
              aria-label={t('Viewer.download')}
              onClick={() => downloadFile({ client, file, url, webviewIntent })}
            >
              <Icon icon={DownloadIcon} />
            </IconButton>
          </>
        )}
      </div>
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
