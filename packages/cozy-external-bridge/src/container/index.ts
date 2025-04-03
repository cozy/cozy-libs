/* eslint-disable no-console */
import * as Comlink from 'comlink'
import { PostMessageWithOrigin } from 'comlink/dist/umd/protocol'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { Q, useClient } from 'cozy-client'
import { IOCozyContact } from 'cozy-client/types/types'
import flag from 'cozy-flags'

import { extractUrl, handleRequestParentOrigin } from './helpers'

const getIframe = (): HTMLIFrameElement => {
  const iframe = document.getElementById(
    'embeddedApp'
  ) as HTMLIFrameElement | null

  if (iframe === null) {
    throw new Error('No iframe found')
  }

  return iframe
}

// Initial redirection is necessary when we load a page from a direct link
// to load the iframe to the direct link
const useInitialRedirection = (): void => {
  const location = useLocation()

  useEffect(() => {
    // If current url is root url, do nothing
    if (
      location.pathname === '/' &&
      location.hash === '' &&
      location.search === ''
    ) {
      return
    }

    const iframe = getIframe()

    const destUrl = new URL(iframe.src)
    destUrl.pathname = location.pathname
    destUrl.hash = location.hash
    destUrl.search = location.search

    const currentIframeUrl = new URL(iframe.src)

    if (destUrl.toString() !== currentIframeUrl.toString()) {
      iframe.src = destUrl.toString()
    }
  }, [])
}

// Allow the iframe to request the origin of the parent window
const useParentOrigin = (origin: string): void => {
  const client = useClient()

  useEffect(() => {
    if (!client) return

    const requestParentOriginHandler = (event: MessageEvent): void =>
      handleRequestParentOrigin(event, origin)

    window.addEventListener('message', requestParentOriginHandler)

    return () => {
      window.removeEventListener('message', requestParentOriginHandler)
    }
  }, [client, origin])
}

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
