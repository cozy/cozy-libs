import { Strings } from '../../api/constants'
import { WebviewRef } from '../../api/models/environments'
import { NativeEvent } from '../../api/models/events'
import { TypeguardService } from './TypeguardService'

export const StaticService = {
  sendSyncMessage(message: string): void {
    if (!TypeguardService.hasReactNativeAPI(window))
      throw new Error(Strings.noRNAPIFound)

    return window.ReactNativeWebView.postMessage(
      JSON.stringify({
        signature: Strings.postMeSignature,
        uri: window.location.hostname,
        message
      })
    )
  },

  getUri(source: WebviewRef | NativeEvent): string {
    return TypeguardService.isWebviewRef(source)
      ? new URL(source.props.source.uri).hostname
      : new URL(source.nativeEvent.url).hostname
  },

  parseNativeEvent({ nativeEvent }: NativeEvent): Record<string, string> {
    return <Record<string, string>>JSON.parse(nativeEvent.data)
  },

  isPostMeMessage({ nativeEvent }: NativeEvent): boolean {
    return nativeEvent.data.includes(Strings.postMeSignature)
  }
}
