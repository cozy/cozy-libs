import { Connection, EventsType, MethodsType } from 'post-me'

import { NativeMethodsRegister } from '../../api'

export interface WebviewSourceUri {
  uri: string

  baseUrl?: never
  html?: never
}

export interface WebviewSourceBaseUrl {
  baseUrl: string
  html: string

  uri?: never
}

export type WebviewSource = WebviewSourceUri | WebviewSourceBaseUrl

export function isWebviewSourceBaseUrl(
  webviewSource: WebviewSource
): webviewSource is WebviewSourceBaseUrl {
  return Boolean((webviewSource as WebviewSourceBaseUrl).html)
}

export interface WebviewRef {
  injectJavaScript: (data: string) => void
  props: {
    source: WebviewSource
  }
}

export interface WebviewWindow extends Window {
  cozy?: {
    flagship?: boolean
  }
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
