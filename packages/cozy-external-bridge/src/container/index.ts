/* eslint-disable no-console */
import * as Comlink from 'comlink'
import { PostMessageWithOrigin } from 'comlink/dist/umd/protocol'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Q, useClient } from 'cozy-client'
import { IOCozyContact } from 'cozy-client/types/types'
import flag from 'cozy-flags'

import { getIframe, extractUrl } from './helpers'
import { useInitialRedirection, useParentOrigin } from './hooks'

export const useExternalBridge = (origin: string): void => {
  const client = useClient()
  const navigate = useNavigate()

  useInitialRedirection()
  useParentOrigin(origin)

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
        console.log('🟢 Replacing route:', url)
        navigate(url, { replace: true })
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
  }, [navigate, client, origin])
}
