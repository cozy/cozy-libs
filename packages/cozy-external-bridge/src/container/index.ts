
import { useRedirectOnLoad, useListenParentOriginRequest } from './hooks'
import { useListenBridgeRequests } from './useListenBridgeRequests'

export const useExternalBridge = (origin: string): void => {
  useRedirectOnLoad()
  useListenParentOriginRequest(origin)
  useListenBridgeRequests(origin)
}
