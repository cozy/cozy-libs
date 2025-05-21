import { useRedirectOnLoad } from './useRedirectOnLoad'
import { useListenParentOriginRequest } from './useListenParentOriginRequest'
import { useListenBridgeRequests } from './useListenBridgeRequests'

export const useExternalBridge = (origin: string): void => {
  useRedirectOnLoad()
  useListenParentOriginRequest(origin)
  useListenBridgeRequests(origin)
}
