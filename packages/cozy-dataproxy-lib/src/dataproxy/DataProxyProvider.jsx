import * as Comlink from 'comlink'
import React, { useContext, useState, useEffect, useCallback } from 'react'

import { useClient } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import { useWebviewIntent } from 'cozy-intent'
import Minilog from 'cozy-minilog'

const log = Minilog('👷‍♂️ [DataProxyProvider]')

const noop = async () => {
  throw new Error('[DataProxy] not ready')
}
const defaultValue = Object.freeze({
  dataProxyServicesAvailable: false,
  ready: false,
  search: noop,
  recents: noop,
  requestLink: noop
})

export const DataProxyContext = React.createContext(defaultValue)

export const useDataProxy = () => {
  const context = useContext(DataProxyContext)
  if (!context) {
    throw new Error('useDataProxy must be used within a DataProxyProvider')
  }
  return context
}

// See https://legacy.reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(e) {
    log.error('[DataProxy iframe errors]', e)
  }
  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children ?? null
  }
}

const DEFAULT_OPTS = {}

export const DataProxyProvider = React.memo(
  ({ children, options = DEFAULT_OPTS }) => {
    const client = useClient()
    const webviewIntent = useWebviewIntent()
    const [iframeUrl, setIframeUrl] = useState()
    const [dataProxyCom, setDataProxyCom] = useState()
    const [dataProxy, setDataProxy] = useState()
    const [dataProxyServicesAvailable, setDataProxyServicesAvailable] =
      useState(undefined)
    const [iframeVersion, setIframeVersion] = useState(0)

    useEffect(() => {
      if (!client) {
        return
      }

      const initIframe = async () => {
        try {
          log.log('Initializing DataProxy intent')
          const result = await client.stackClient.fetchJSON(
            'POST',
            '/intents',
            {
              data: {
                type: 'io.cozy.intents',
                attributes: {
                  action: 'OPEN',
                  type: 'io.cozy.dataproxy',
                  permissions: ['GET']
                }
              }
            }
          )

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
    }, [client, webviewIntent, options])

    const onIframeLoaded = useCallback(() => {
      const ifr = document.getElementById('DataProxy')
      const remote = Comlink.wrap(Comlink.windowEndpoint(ifr.contentWindow))
      setDataProxyCom(() => remote)
    }, [setDataProxyCom])

    const onReceiveMessage = useCallback(
      event => {
        try {
          if (typeof event.origin !== 'string') return
          if (!event.origin.includes('dataproxy')) return
          const d = event?.data
          if (
            d &&
            typeof d === 'object' &&
            d.type === 'DATAPROXYMESSAGE' &&
            d.payload === 'READY'
          ) {
            onIframeLoaded()
          }
        } catch (e) {
          log.error('[DataProxy] onReceiveMessage error', e)
        }
      },
      [onIframeLoaded]
    )

    useEffect(() => {
      window.addEventListener('message', onReceiveMessage)
      return () => {
        window.removeEventListener('message', onReceiveMessage)
      }
    }, [onReceiveMessage])

    useEffect(() => {
      const doAsync = async () => {
        // Make a global search
        const search = async (search, searchOptions) => {
          log.log('Send search query to DataProxy: ', search, searchOptions)
          const result = await dataProxyCom.search(search, {
            ...options,
            ...searchOptions
          })
          return result
        }

        const recents = () => {
          log.log('Send recents query to DataProxy: ')
          return dataProxyCom.recents()
        }

        // Request through cozy-client
        const requestLink = async (operation, options) => {
          log.log('Send request to DataProxy : ', operation)
          if (options?.fetchPolicy) {
            // Functions cannot be serialized and thus passed to the iframe
            delete options.fetchPolicy
          }
          return dataProxyCom.requestLink?.(operation, options)
        }
        const newDataProxy = {
          dataProxyServicesAvailable,
          ready: Boolean(dataProxyCom),
          search,
          recents,
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
    }, [dataProxyCom, client, dataProxyServicesAvailable, options])

    const reloadIframe = useCallback(() => {
      setIframeVersion(v => v + 1)
      log.log('Reload iframe with new version ', iframeVersion)
    }, [])

    const iframeKey = `${iframeUrl}::${iframeVersion}` // Useful to force iframe reload when key change

    return (
      <DataProxyContext.Provider value={dataProxy || defaultValue}>
        {children ?? null}
        <ErrorBoundary>
          {iframeUrl ? (
            <iframe
              key={iframeKey}
              id="DataProxy"
              src={iframeUrl}
              width={0}
              height={0}
              style={{
                width: 0,
                height: 0
              }}
              sandbox="allow-same-origin allow-scripts"
              onError={() => {
                log.error('[DataProxy] iframe load error')
                reloadIframe()
              }}
            ></iframe>
          ) : null}
        </ErrorBoundary>
      </DataProxyContext.Provider>
    )
  }
)

DataProxyProvider.displayName = 'DataProxyProvider'
