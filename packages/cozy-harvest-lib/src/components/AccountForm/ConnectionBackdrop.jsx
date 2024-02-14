import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { useWebviewIntent } from 'cozy-intent'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import LinearProgress from 'cozy-ui/transpiled/react/LinearProgress'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    zIndex: 'var(--zIndex-modal)',
    inset: 0
  }
})

export const ConnectionBackdrop = ({ name }) => {
  const styles = useStyles()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  return (
    <CozyTheme variant="inverted">
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
    </CozyTheme>
  )
}

const ConnectionBackdropWrapper = ({ name }) => {
  const webviewIntent = useWebviewIntent()

  useEffect(() => {
    if (webviewIntent) {
      // On mounting, we want to ensure the UI displays white icone because the backdrop is dark
      // The WorkerView is then responsible to change back the icons to dark on white theme
      webviewIntent.call(
        'setFlagshipUI',
        {
          bottomTheme: 'light',
          topTheme: 'light'
        },
        'ConnectionBackdrop Start'
      )
    }

    // As a precaution, we set the icons back to dark on white theme when unmounting
    // This is to ensure the icons are not stuck in white on white theme in unhappy paths
    return () => {
      if (webviewIntent) {
        webviewIntent.call(
          'setFlagshipUI',
          {
            bottomTheme: 'dark',
            topTheme: 'dark'
          },
          'ConnectionBackdrop End'
        )
      }
    }
  }, [webviewIntent])

  return createPortal(<ConnectionBackdrop name={name} />, document.body)
}

export default ConnectionBackdropWrapper
