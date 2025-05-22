import { useListenBridgeRequests } from './useListenBridgeRequests'
import { useListenParentOriginRequest } from './useListenParentOriginRequest'
import { useRedirectOnLoad } from './useRedirectOnLoad'

interface UseExternalBridgeReturnType {
  isReady: boolean
}

export const useExternalBridge = (
  origin: string
): UseExternalBridgeReturnType => {
  useRedirectOnLoad()

  const { isReady: isParentOriginRequestListenerReady } =
    useListenParentOriginRequest(origin)
  const { isReady: isBridgeListenerReady } = useListenBridgeRequests(origin)

  const isReady = isParentOriginRequestListenerReady && isBridgeListenerReady

  return { isReady }
}
