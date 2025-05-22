import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Minilog from 'cozy-minilog'

import { BRIDGE_ROUTE_PREFIX } from './constants'
import { getIframe } from './helpers'

const log = Minilog('🌉 [Container bridge]')

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

      log.debug('Redirecting iframe to', destUrl.toString())
    }
  }, [])
}
