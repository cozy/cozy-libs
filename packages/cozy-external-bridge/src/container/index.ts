import { useBuildUrlToLoad } from './useBuildUrlToLoad'
import { useListenBridgeRequests } from './useListenBridgeRequests'
import { useListenParentOriginRequest } from './useListenParentOriginRequest'

interface UseExternalBridgeReturnType {
  isReady: boolean
  urlToLoad: string | undefined
}

export const useExternalBridge = (
  origin: string
): UseExternalBridgeReturnType => {
  const { urlToLoad } = useBuildUrlToLoad(origin)

  const { isReady: isParentOriginRequestListenerReady } =
    useListenParentOriginRequest(origin)
  const { isReady: isBridgeListenerReady } = useListenBridgeRequests(origin)

  const isReady = isParentOriginRequestListenerReady && isBridgeListenerReady

  return { isReady, urlToLoad }
}
