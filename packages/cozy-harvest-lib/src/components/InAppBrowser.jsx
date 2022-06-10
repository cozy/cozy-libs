import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWebviewIntent } from 'cozy-intent'
import logger from '../logger'

const InAppBrowser = ({ url, onClose, intentsApi = {} }) => {
  const webviewIntent = useWebviewIntent()
  const fetchSessionCode = intentsApi?.fetchSessionCode
    ? intentsApi?.fetchSessionCode
    : () => webviewIntent.call('fetchSessionCode')
  const showInAppBrowser = intentsApi?.showInAppBrowser
    ? intentsApi?.showInAppBrowser
    : url => webviewIntent.call('showInAppBrowser', { url })
  const closeInAppBrowser = intentsApi?.closeInAppBrowser
    ? intentsApi?.closeInAppBrowser
    : () => webviewIntent.call('closeInAppBrowser')

  const ready = Boolean(
    webviewIntent ||
      (intentsApi?.fetchSessionCode &&
        intentsApi?.showInAppBrowser &&
        intentsApi?.closeInAppBrowser)
  )

  useEffect(() => {
    async function insideEffect() {
      if (ready) {
        try {
          const sessionCode = await fetchSessionCode()
          logger.debug('got session code', sessionCode)
          const iabUrl = new URL(url)
          iabUrl.searchParams.append('session_code', sessionCode)
          const result = await showInAppBrowser(iabUrl.toString())
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
      closeInAppBrowser()
    }
  }, [ready, url, onClose])
  return null
}

InAppBrowser.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  intentsApi: PropTypes.object
}

export default InAppBrowser
