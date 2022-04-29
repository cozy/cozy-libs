import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWebviewIntent } from 'cozy-intent'
import logger from '../logger'

const InAppBrowser = ({ url, onClose }) => {
  const webviewIntent = useWebviewIntent()

  useEffect(() => {
    async function insideEffect() {
      if (webviewIntent) {
        const result = await webviewIntent.call('showInAppBrowser', { url })
        if (result?.type === 'cancel' && onClose) {
          onClose()
        } else if (result?.type !== 'dismiss') {
          logger.error('Unexpected InAppBrowser result', result)
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
