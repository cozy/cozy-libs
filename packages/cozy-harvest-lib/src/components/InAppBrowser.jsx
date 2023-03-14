import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

import { useWebviewIntent } from 'cozy-intent'

import { intentsApiProptype } from '../helpers/proptypes'
import logger from '../logger'

const InAppBrowser = ({ url, onClose, intentsApi }) => {
  if (intentsApi) {
    return (
      <InAppBrowserWithIntentsApi
        url={url}
        onClose={onClose}
        intentsApi={intentsApi}
      />
    )
  } else {
    return <InAppBrowserWithWebviewIntent url={url} onClose={onClose} />
  }
}

const InAppBrowserWithWebviewIntent = ({ url, onClose }) => {
  const webviewIntent = useWebviewIntent()
  const isReady = Boolean(webviewIntent)
  useEffect(() => {
    async function insideEffect() {
      if (isReady) {
        try {
          logger.debug('url at the beginning: ', url)
          const sessionCode = await webviewIntent.call('fetchSessionCode')
          logger.debug('got session code', sessionCode)
          const iabUrl = new URL(url)
          iabUrl.searchParams.append('session_code', sessionCode)
          // we need to decodeURIComponent since toString() encodes URL
          // but native browser will also encode them.
          const urlToOpen = decodeURIComponent(iabUrl.toString())
          logger.debug('url to open: ', urlToOpen)
          const result = await webviewIntent.call('showInAppBrowser', {
            url: urlToOpen
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
  }, [isReady, url, onClose, webviewIntent])
  return null
}

const InAppBrowserWithIntentsApi = ({ url, onClose, intentsApi = {} }) => {
  const {
    fetchSessionCode,
    showInAppBrowser,
    closeInAppBrowser,
    tokenParamName = 'session_code'
  } = intentsApi

  const isReady = Boolean(
    intentsApi?.fetchSessionCode &&
      intentsApi?.showInAppBrowser &&
      intentsApi?.closeInAppBrowser
  )

  useEffect(() => {
    async function insideEffect() {
      if (isReady) {
        try {
          logger.debug('url at the beginning: ', url)
          const sessionCode = await fetchSessionCode()
          logger.debug('got session code', sessionCode)
          const iabUrl = new URL(url)
          iabUrl.searchParams.append(tokenParamName, sessionCode)
          // we need to decodeURIComponent since toString() encodes URL
          // but native browser will also encode them.
          const urlToOpen = decodeURIComponent(iabUrl.toString())
          logger.debug('url to open: ', urlToOpen)
          const result = await showInAppBrowser(urlToOpen)
          if (result?.state !== 'dismiss' && result?.state !== 'cancel') {
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
  }, [
    isReady,
    url,
    onClose,
    closeInAppBrowser,
    fetchSessionCode,
    showInAppBrowser,
    tokenParamName
  ])
  return null
}

InAppBrowser.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  intentsApi: intentsApiProptype
}

export default InAppBrowser
