import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'

import { BRIDGE_ROUTE_PREFIX } from './constants'
import { getIframe, handleRequestParentOrigin } from './helpers'

// When we load the container app, we want to forward
// the relevant part of the URL to the iframe
export const useRedirectOnLoad = (): void => {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith(BRIDGE_ROUTE_PREFIX)) {
      const iframe = getIframe()

      const destUrl = new URL(iframe.src)
      destUrl.pathname = location.pathname.replace(BRIDGE_ROUTE_PREFIX, '')
      destUrl.hash = location.hash
      destUrl.search = location.search
      iframe.src = destUrl.toString()
    }
  }, [])
}

// Allow the iframe to request the origin of the parent window
export const useParentOrigin = (origin: string): void => {
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
