import { Connection, EventsType, MethodsType } from 'post-me'

import { NativeMethodsRegister } from '@api'

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

export type WebviewConnection = Connection<
  MethodsType,
  EventsType,
  NativeMethodsRegister,
  EventsType
>
