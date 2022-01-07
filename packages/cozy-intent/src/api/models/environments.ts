export interface WebviewRef {
  injectJavaScript: (data: string) => void
  props: {
    source: {
      uri: string
    }
  }
}

export interface WebviewWindow extends Window {
  ReactNativeWebView: {
    postMessage: (message: string) => void
  }
}
