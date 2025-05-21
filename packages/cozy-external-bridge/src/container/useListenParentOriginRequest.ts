import { useEffect } from 'react'

import { useClient } from 'cozy-client'

import { handleParentOriginRequest } from './helpers'

// Allow the iframe to request the origin of the parent window
export const useListenParentOriginRequest = (origin: string): void => {
  const client = useClient()

  useEffect(() => {
    if (!client) return

    const parentOriginRequestHandler = (event: MessageEvent): void =>
      handleParentOriginRequest(event, origin)

    window.addEventListener('message', parentOriginRequestHandler)

    return () => {
      window.removeEventListener('message', parentOriginRequestHandler)
    }
  }, [client, origin])
}
