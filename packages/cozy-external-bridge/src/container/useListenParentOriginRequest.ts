import { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import Minilog from 'cozy-minilog'

import { handleParentOriginRequest } from './helpers'

const log = Minilog('🌉 [Container bridge]')

interface UseListenParentOriginRequestReturnType {
  isReady: boolean
}

// Allow the iframe to request the origin of the parent window
export const useListenParentOriginRequest = (
  origin: string
): UseListenParentOriginRequestReturnType => {
  const client = useClient()
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    if (!client) return

    const parentOriginRequestHandler = (event: MessageEvent): void =>
      handleParentOriginRequest(event, origin)

    window.addEventListener('message', parentOriginRequestHandler)

    log.debug('Listening to parent origin request')

    setIsReady(true)

    return () => {
      window.removeEventListener('message', parentOriginRequestHandler)
    }
  }, [client, origin])

  return { isReady }
}
