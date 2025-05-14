import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'

import { getIframe, handleRequestParentOrigin } from './helpers'

// Initial redirection is necessary when we load a page from a direct link
// to load the iframe to the direct link
export const useInitialRedirection = (): void => {
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
