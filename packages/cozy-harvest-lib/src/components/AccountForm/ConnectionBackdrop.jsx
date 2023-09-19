import React from 'react'

import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import LinearProgress from 'cozy-ui/transpiled/react/LinearProgress'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
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
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  return (
    <MuiCozyTheme variant="inverted">
      <div className={styles.container}>
        <Backdrop
          open
          className="u-p-2"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)' // Manually adding the -webkit- prefix as there's no CSS preprocessor
          }}
        >
          <div className="u-w-6 u-w-100-s">
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              className="u-ta-center"
            >
              {t('connectionBackdrop.connecting')}
            </Typography>

            <LinearProgress className="u-mt-1-half u-w-100" />

            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              className="u-mt-1 u-ta-center"
            >
              {t('connectionBackdrop.progress', { name })}
            </Typography>
          </div>
        </Backdrop>
      </div>
    </MuiCozyTheme>
  )
}

export default ConnectionBackdrop
