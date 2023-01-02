import React from 'react'
import cx from 'classnames'

import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import CrossMediumIcon from 'cozy-ui/transpiled/react/Icons/CrossMedium'
import LinearProgress from 'cozy-ui/transpiled/react/LinearProgress'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Typography from 'cozy-ui/transpiled/react/Typography'

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    zIndex: 'var(--zIndex-modal)',
    inset: 0
  },
  iconButton: {
    position: 'absolute'
  }
})

const ConnectionBackdrop = ({ name, onClose }) => {
  const styles = useStyles()
  const { t } = useI18n()

  return (
    <MuiCozyTheme variant="inverted">
      <div className={styles.container}>
        <Backdrop open className="u-p-2">
          <IconButton
            size="large"
            onClick={onClose}
            className={cx('u-right-0 u-top-0 u-m-1 u-m-0-s', styles.iconButton)}
          >
            <Icon icon={CrossMediumIcon} />
          </IconButton>
          <div className="u-w-6 u-w-100-s">
            <Typography variant="h4" className="u-ta-center">
              {t('connectionBackdrop.connecting')}
            </Typography>
            <LinearProgress className="u-mt-1 u-w-100" />
            <Typography variant="body2" className="u-mt-1 u-ta-center">
              {t('connectionBackdrop.progress', { name })}
            </Typography>
          </div>
        </Backdrop>
      </div>
    </MuiCozyTheme>
  )
}

export default ConnectionBackdrop
