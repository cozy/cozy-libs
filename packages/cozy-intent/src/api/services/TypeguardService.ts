import { NativeEvent } from '../../api/models/events'
import { WebviewRef, WebviewWindow } from '../../api/models/environments'

export const TypeguardService = {
  hasReactNativeAPI(window: Window): window is WebviewWindow {
    return (window as WebviewWindow).ReactNativeWebView !== undefined
  },
  isWebviewRef(object: unknown): object is WebviewRef {
    return (object as WebviewRef).injectJavaScript !== undefined
  },
  isNativeEvent(object: unknown): object is NativeEvent {
    return (object as NativeEvent).nativeEvent !== undefined
  },
  isWebviewWindow(window: Window): window is WebviewWindow {
    return (window as WebviewWindow).ReactNativeWebView !== undefined
  }
}
