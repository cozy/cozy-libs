import { WebviewRef, WebviewWindow } from '../../api/models/environments'

export const TypeguardService = {
  hasReactNativeAPI(window: Window): window is WebviewWindow {
    return (window as WebviewWindow).ReactNativeWebView !== undefined
  },
  isWebviewRef(object: unknown): object is WebviewRef {
    return (object as WebviewRef).injectJavaScript !== undefined
  },
  isWebviewWindow(window: Window): window is WebviewWindow {
    return (window as WebviewWindow).ReactNativeWebView !== undefined
  }
}
