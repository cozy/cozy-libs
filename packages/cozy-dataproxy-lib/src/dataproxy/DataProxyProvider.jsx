import * as Comlink from 'comlink'
import React, { useContext, useState, useEffect, useCallback } from 'react'

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
  const [dataProxyCom, setDataProxyCom] = useState()
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
          // We do not set dataProxyServicesAvailable to false here
          // because we are waiting webviewIntent to be initialized
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

        setDataProxyCom(() => ({
          search: (search, searchOptions) =>
            webviewIntent?.call('search', search, {
              ...options,
              ...searchOptions
            })
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

  const onIframeLoaded = useCallback(() => {
    const ifr = document.getElementById('DataProxy')
    const remote = Comlink.wrap(Comlink.windowEndpoint(ifr.contentWindow))
    setDataProxyCom(() => remote)
  }, [setDataProxyCom])

  const onReceiveMessage = useCallback(
    event => {
      if (!event.origin.includes('dataproxy')) {
        return
      }
      const eventData = event?.data
      if (eventData && typeof eventData === 'object') {
        if (
          eventData.type === 'DATAPROXYMESSAGE' &&
          eventData.payload === 'READY'
        ) {
          onIframeLoaded()
        }
      }
    },
    [onIframeLoaded]
  )

  useEffect(function () {
    window.addEventListener('message', onReceiveMessage)
    return function () {
      window.removeEventListener('message', onReceiveMessage)
    }
  })

  useEffect(() => {
    const doAsync = async () => {
      // Make a global search
      const search = async (search, searchOptions) => {
        log.log('Send search query to DataProxy: ', search)
        const result = await dataProxyCom.search(search, {
          ...options,
          ...searchOptions
        })
        return result
      }

      // Request through cozy-client
      const requestLink = async (operation, options) => {
        log.log('Send request to DataProxy : ', operation)
        if (options.fetchPolicy) {
          // Functions cannot be serialized and thus passed to the iframe
          delete options.fetchPolicy
        }
        return dataProxyCom.requestLink(operation, options)
      }
      const newDataProxy = {
        dataProxyServicesAvailable,
        search,
        requestLink
      }

      client.links.forEach(link => {
        if (link.registerDataProxy) {
          // This is required as the DataProxy is not ready when the DataProxyLink is created
          link.registerDataProxy(newDataProxy)
        }
      })

      setDataProxy(newDataProxy)
    }
    if (dataProxyCom && client?.links) {
      doAsync()
    }
  }, [dataProxyCom, client, dataProxyServicesAvailable])

  return (
    <DataProxyContext.Provider value={dataProxy || {}}>
      {(dataProxyServicesAvailable === false || dataProxy) && children}
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
        ></iframe>
      ) : undefined}
    </DataProxyContext.Provider>
  )
})

DataProxyProvider.displayName = 'DataProxyProvider'
