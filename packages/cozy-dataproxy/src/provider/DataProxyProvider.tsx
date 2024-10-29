import * as Comlink from 'comlink'
import React, { useContext, useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import Minilog from 'cozy-minilog'

const log = Minilog('👷‍♂️ [DataProxyProvider]')
import { useCozyDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

export interface DataProxyInterface {
  dataProxyServicesAvailable: boolean | undefined
  search: (query: string) => Promise<unknown>
}

export interface DataProxyWorker {
  search: (query: string) => Promise<unknown>
}

export const DataProxyContext = React.createContext<
  DataProxyInterface | undefined
>(undefined)

export const useDataProxy = (): DataProxyInterface | undefined => {
  const context = useContext(DataProxyContext)

  return context
}

export const DataProxyProvider = React.memo(({ children }) => {
  const client = useClient()
  const dialog = useCozyDialog('abcd')
  console.log(dialog)
  const [iframeUrl, setIframeUrl] = useState<string>()
  const [dataProxy, setDataProxy] = useState<DataProxyWorker>()
  const [dataProxyServicesAvailable, setDataProxyServicesAvailable] = useState<
    boolean | undefined
  >(undefined)

  useEffect(() => {
    if (!client) return

    const initIframe = async (): Promise<void> => {
      try {
        if (!flag('cozy.assistant.withSearchResult')) {
          log.log(
            'Dataproxy features will be disabled due to missing feature flags'
          )
          setDataProxyServicesAvailable(false)
          return
        }

        log.log('Initializing DataProxy intent')
        const result = await client
          .getStackClient()
          .fetchJSON('POST', '/intents', {
            data: {
              type: 'io.cozy.intents',
              attributes: {
                action: 'OPEN',
                type: 'io.cozy.dataproxy',
                permissions: ['GET']
              }
            }
          })

        // @ts-expect-error
        if (!result.data?.attributes?.services?.[0]?.href) {
          log.log(
            'No dataproxy intent available, dataproxy features will be disabled'
          )
          setDataProxyServicesAvailable(false)
          return
        }

        // @ts-expect-error
        setIframeUrl(result.data.attributes.services[0]?.href)
        setDataProxyServicesAvailable(true)
      } catch (error) {
        setDataProxyServicesAvailable(false)
        log.error(
          'Error whild initializing Search intent, dataproxy features will be disabled',
          error
        )
      }
    }

    initIframe()
  }, [client])

  const onIframeLoaded = () => {
    const ifr = document.getElementById('DataProxy')
    // @ts-expect-error
    const remote = Comlink.wrap<DataProxyWorker>(
      Comlink.windowEndpoint(ifr.contentWindow)
    )
    setDataProxy(() => remote)
  }

  const search = async (search: string) => {
    log.log('Send search query to DataProxy iframe')

    if (!dataProxy) throw new Error('aeijoazejao')

    const result = await dataProxy.search(search)

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
          sandbox="allow-same-origin allow-scripts"
          onLoad={onIframeLoaded}
        ></iframe>
      ) : undefined}
    </DataProxyContext.Provider>
  )
})

DataProxyProvider.displayName = 'DataProxyProvider'
