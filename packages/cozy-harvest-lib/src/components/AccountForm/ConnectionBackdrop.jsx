import React from 'react'

import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import LinearProgress from 'cozy-ui/transpiled/react/LinearProgress'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    zIndex: 'var(--zIndex-modal)',
    inset: 0
  }
})

const ConnectionBackdrop = ({ name }) => {
  const styles = useStyles()
  const { t } = useI18n()

  return (
    <MuiCozyTheme variant="inverted">
      <div className={styles.container}>
        <Backdrop open className="u-p-2">
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
