import { Connection, ChildHandshake } from 'post-me'

import { CozyBar } from '../../api/models/applications'
import { NativeEvent } from '../../api/models/events'
import { Strings } from '../../api/constants'
import { TypeguardService } from './TypeguardService'
import { WebviewMessenger } from './WebviewMessenger'
import { WebviewRef } from '../../api/models/environments'
import { WebviewService } from './WebviewService'

declare const cozy: CozyBar | undefined

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
  },

  getBarInitAPI(): ((webviewContext: WebviewService) => void) | undefined {
    try {
      return cozy?.bar?.setWebviewContext
    } catch (err) {
      return undefined
    }
  },

  async getConnection(
    callBack: (connection: Connection) => void
  ): Promise<void> {
    if (!TypeguardService.isWebviewWindow(window))
      throw new Error(Strings.flagshipButNoRNAPI)

    StaticService.sendSyncMessage(Strings.webviewIsRendered)

    const result = await ChildHandshake(new WebviewMessenger(window))

    callBack(result)
  }
}
