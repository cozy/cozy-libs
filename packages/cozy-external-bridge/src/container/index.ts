import * as Comlink from 'comlink'
import { PostMessageWithOrigin } from 'comlink/dist/umd/protocol'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Q, useClient } from 'cozy-client'
import { IOCozyContact } from 'cozy-client/types/types'
import flag from 'cozy-flags'
import Minilog from 'cozy-minilog'

import { BRIDGE_ROUTE_PREFIX } from './constants'
import { getIframe, extractUrl } from './helpers'
import { useRedirectOnLoad, useListenParentOriginRequest } from './hooks'

const log = Minilog('🌉 [Container bridge]')

export const useExternalBridge = (origin: string): void => {
  const client = useClient()
  const navigate = useNavigate()

  useRedirectOnLoad()
  useListenParentOriginRequest(origin)

  useEffect(() => {
    if (!client) return

    const exposedMethods = {
      // Proof of concepts of Twake <-> Cozy communication
      getContacts: async (): Promise<IOCozyContact> => {
        const { data } = (await client.query(Q('io.cozy.contacts'))) as {
          data: Promise<IOCozyContact>
        }

        return data
      },
      getFlag: (key: string): string | boolean => {
        return flag(key)
      },
      // Proof of concepts of Twake <-> Cozy URL synchronization
      updateHistory: (newUrl: string): void => {
        const url = extractUrl(newUrl)
        log.debug(
          `Navigating to ${url} because received ${newUrl} from embedded app`
        )
        navigate(BRIDGE_ROUTE_PREFIX + url, { replace: true })
      }
    }

    Comlink.expose(
      exposedMethods,
      Comlink.windowEndpoint(
        getIframe().contentWindow as PostMessageWithOrigin,
        self,
        origin
      )
    )

    log.debug('Bridge initialized')
  }, [navigate, client, origin])
}
