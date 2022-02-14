import { ChildHandshake, RemoteHandle } from 'post-me'

import { isFlagshipApp } from 'cozy-device-helper'

import { WebviewMessenger } from '../api/services/WebviewMessenger'
import { WebviewService } from '../api/services/WebviewService'
import { WebviewWindow } from '../api/models/environments'
import { NativeMethodsRegister } from 'api/models/methods'

export class MockWebviewMessenger extends WebviewMessenger {}

export class MockWebviewService extends WebviewService {}

type JestWindow = Window & typeof globalThis & WebviewWindow

export const mockWebviewWindow = (): JestWindow => {
  const win = window

  return Object.assign(win, {
    ReactNativeWebView: {
      postMessage: jest.fn()
    }
  })
}

const mockCall = jest.fn()

export const mockConnection = {
  localHandle: jest.fn(),
  remoteHandle: (): RemoteHandle => ({
    call: mockCall,
    customCall: jest.fn(),
    setCallTransfer: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    once: jest.fn()
  }),
  close: jest.fn()
}

export const mockWebviewService = new MockWebviewService(mockConnection)

export const mockIsFlagshipApp = isFlagshipApp as jest.Mock

export const mockChildHandshake = ChildHandshake as jest.Mock

export const mockSetWebviewContext = jest.fn()

export const mockCozyBar = {
  bar: {
    setWebviewContext: mockSetWebviewContext
  }
}

export const mockWebviewRef = {
  injectJavaScript: jest.fn(),
  props: {
    source: {
      uri: 'mockUri'
    }
  }
}

export const mockNativeMethods: NativeMethodsRegister = {
  backToHome: jest.fn(),
  logout: jest.fn(),
  openApp: jest.fn()
}
