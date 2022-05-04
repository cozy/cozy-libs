import { Connection, EventsType, MethodsType } from 'post-me'

import { NativeMethodsRegister } from '../../api'

export interface WebviewSourceUri {
  uri: string

  baseUrl?: never
  html?: never
}

export interface WebiewSourceBaseUrl {
  baseUrl: string
  html: string

  uri?: never
}

export type WebviewSource = WebviewSourceUri | WebiewSourceBaseUrl

export function isWebviewSourceBaseUrl(
  webviewSource: WebviewSource
): webviewSource is WebiewSourceBaseUrl {
  if ((webviewSource as WebiewSourceBaseUrl).html) {
    return true
  }
  return false
}

export interface WebviewRef {
  injectJavaScript: (data: string) => void
  props: {
    source: WebviewSource
  }
}

export interface WebviewWindow extends Window {
  ReactNativeWebView: {
    postMessage: (message: string) => void
  }
}

export type WebviewConnection = Connection<
  MethodsType,
  EventsType,
  NativeMethodsRegister,
  EventsType
>
