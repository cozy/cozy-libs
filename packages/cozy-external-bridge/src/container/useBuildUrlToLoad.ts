import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Minilog from 'cozy-minilog'

import { BRIDGE_ROUTE_PREFIX } from './constants'

const log = Minilog('🌉 [Container bridge]')

interface UseBuildUrlToLoadReturnType {
  urlToLoad: string | undefined
}

// When we load the container app, we want to forward
// the relevant part of the URL to the iframe
export const useBuildUrlToLoad = (
  origin: string
): UseBuildUrlToLoadReturnType => {
  const location = useLocation()
  const [urlToLoad, setUrlToLoad] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (location.pathname.startsWith(BRIDGE_ROUTE_PREFIX)) {
      const destUrl = new URL(origin)
      destUrl.pathname = location.pathname.replace(BRIDGE_ROUTE_PREFIX, '')
      destUrl.hash = location.hash
      destUrl.search = location.search

      log.debug('Setting iframe to', destUrl.toString(), 'after modification')
      setUrlToLoad(destUrl.toString())
    } else {
      log.debug('Setting iframe to', origin)
      setUrlToLoad(origin)
    }
  }, [])

  return { urlToLoad }
}
