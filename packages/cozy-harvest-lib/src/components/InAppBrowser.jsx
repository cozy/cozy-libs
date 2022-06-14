import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWebviewIntent } from 'cozy-intent'
import logger from '../logger'
import { intentsApiProptype } from '../helpers/proptypes'

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

  const tokenParamName = intentsApi?.tokenParamName
    ? intentsApi?.tokenParamName
    : 'session_code'

  const isReady = Boolean(
    webviewIntent ||
      (intentsApi?.fetchSessionCode &&
        intentsApi?.showInAppBrowser &&
        intentsApi?.closeInAppBrowser)
  )

  useEffect(() => {
    async function insideEffect() {
      if (isReady) {
        try {
          const sessionCode = await fetchSessionCode()
          logger.debug('got session code', sessionCode)
          const iabUrl = new URL(url)
          iabUrl.searchParams.append(tokenParamName, sessionCode)
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
  }, [isReady, url, onClose])
  return null
}

InAppBrowser.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  intentsApi: intentsApiProptype
}

export default InAppBrowser
