import * as Comlink from 'comlink'
import React, { useContext, useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import { useWebviewIntent } from 'cozy-intent'
import Minilog from 'cozy-minilog'

const log = Minilog('👷‍♂️ [DataProxyProvider]')

export const DataProxyContext = React.createContext()

export const useDataProxy = () => {
  const context = useContext(DataProxyContext)
  if (!context) {
    throw new Error('useDataProxy must be used within a DataProxyProvider')
  }
  return context
}

export const DataProxyProvider = React.memo(({ children, options = {} }) => {
  const client = useClient()
  const webviewIntent = useWebviewIntent()
  const [iframeUrl, setIframeUrl] = useState()
  const [dataProxy, setDataProxy] = useState()
  const [dataProxyServicesAvailable, setDataProxyServicesAvailable] =
    useState(undefined)

  useEffect(() => {
    if (!client) return

    const initIframe = async () => {
      try {
        log.log('Initializing DataProxy intent')
        const result = await client.stackClient.fetchJSON('POST', '/intents', {
          data: {
            type: 'io.cozy.intents',
            attributes: {
              action: 'OPEN',
              type: 'io.cozy.dataproxy',
              permissions: ['GET']
            }
          }
        })

        if (!result.data?.attributes?.services?.[0]?.href) {
          log.log(
            'No dataproxy intent available, dataproxy features will be disabled'
          )
          setDataProxyServicesAvailable(false)
          return
        }

        setIframeUrl(result.data.attributes.services[0]?.href)
        setDataProxyServicesAvailable(true)
      } catch (error) {
        setDataProxyServicesAvailable(false)
        log.error(
          'Error while initializing Search intent, dataproxy features will be disabled',
          error
        )
      }
    }

    const initFlagship = async () => {
      try {
        if (!webviewIntent) {
          return
        }

        log.log('Initializing DataProxy intent in Flagship app')
        const isSearchAvailable =
          (await webviewIntent.call('isAvailable', 'search')) ?? false

        if (!isSearchAvailable) {
          log.log(
            'Dataproxy features will be disabled due to feature not supported by Flagship app'
          )
          setDataProxyServicesAvailable(false)
          return
        }

        setDataProxy(() => ({
          search: (search, options) =>
            webviewIntent?.call('search', search, options)
        }))

        setDataProxyServicesAvailable(isSearchAvailable)
      } catch (error) {
        setDataProxyServicesAvailable(false)
        log.error(
          `Error while initializing Flagship's Search, dataproxy features will be disabled`,
          error
        )
      }
    }

    if (!flag('cozy.search.enabled')) {
      log.log(
        'Dataproxy features will be disabled due to missing feature flags'
      )
      setDataProxyServicesAvailable(false)
      return
    }

    if (isFlagshipApp()) {
      initFlagship()
    } else {
      initIframe()
    }
  }, [client, webviewIntent])

  const onIframeLoaded = () => {
    const ifr = document.getElementById('DataProxy')
    const remote = Comlink.wrap(Comlink.windowEndpoint(ifr.contentWindow))
    setDataProxy(() => remote)
  }

  const search = async search => {
    log.log('Send search query to DataProxy')
    const result = await dataProxy.search(search, options)

    return result
  }

  const value = {
    dataProxyServicesAvailable,
    search
  }

  return (
    <DataProxyContext.Provider value={value}>
      {children}
      {iframeUrl ? (
        <iframe
          id="DataProxy"
          src={iframeUrl}
          width={0}
          height={0}
          style={{
            width: 0,
            height: 0
          }}
          sandbox="allow-same-origin allow-scripts"
          onLoad={onIframeLoaded}
        ></iframe>
      ) : undefined}
    </DataProxyContext.Provider>
  )
})

DataProxyProvider.displayName = 'DataProxyProvider'
