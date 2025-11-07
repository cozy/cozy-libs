import { useBuildUrlToLoad } from './useBuildUrlToLoad'
import { useListenBridgeRequests } from './useListenBridgeRequests'
import { useListenParentOriginRequest } from './useListenParentOriginRequest'

interface UseExternalBridgeReturnType {
  isReady: boolean
  urlToLoad: string | undefined
}

export const useExternalBridge = (url: string): UseExternalBridgeReturnType => {
  const { urlToLoad } = useBuildUrlToLoad(url)

  const { isReady: isParentOriginRequestListenerReady } =
    useListenParentOriginRequest(url)
  const { isReady: isBridgeListenerReady } = useListenBridgeRequests(url)

  const isReady = isParentOriginRequestListenerReady && isBridgeListenerReady

  return { isReady, urlToLoad }
}
