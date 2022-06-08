import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWebviewIntent } from 'cozy-intent'
import logger from '../logger'

const InAppBrowser = ({ url, onClose }) => {
  const webviewIntent = useWebviewIntent()

  useEffect(() => {
    async function insideEffect() {
      if (webviewIntent) {
        try {
          const sessionCode = await webviewIntent.call('fetchSessionCode')
          logger.debug('got session code', sessionCode)
          const iabUrl = new URL(url)
          iabUrl.searchParams.append('session_code', sessionCode)
          const result = await webviewIntent.call('showInAppBrowser', {
            url: iabUrl.toString()
          })
          if (result?.type !== 'dismiss' && result?.type !== 'cancel') {
            logger.error('Unexpected InAppBrowser result', result)
          }
        } catch (err) {
          logger.error('unexpected fetchSessionCode result', err)
        }
        if (onClose) {
          onClose()
        }
      }
    }
    insideEffect()
    return function cleanup() {
      webviewIntent.call('closeInAppBrowser')
    }
  }, [webviewIntent, url, onClose])
  return null
}

InAppBrowser.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

export default InAppBrowser
