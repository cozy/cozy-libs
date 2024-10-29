import { ChildHandshake, RemoteHandle } from 'post-me'

import {
  NativeMethodsRegister,
  WebviewMessenger,
  WebviewService,
  WebviewWindow
} from '../src/api'

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

export const mockChildHandshake = ChildHandshake as jest.Mock

export const mockSetWebviewContext = jest.fn()

export const mockCozyBar = {
  setWebviewContext: mockSetWebviewContext
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
  hideSplashScreen: jest.fn(),
  logout: jest.fn(),
  openApp: jest.fn(),
  setDefaultRedirection: jest.fn(),
  setFlagshipUI: jest.fn(),
  showSplashScreen: jest.fn(),
  isNativePassInstalledOnDevice: jest.fn(),
  scanDocument: jest.fn(),
  isScannerAvailable: jest.fn(),
  openSettingBiometry: jest.fn(),
  toggleSetting: jest.fn(),
  isBiometryDenied: jest.fn(),
  openAppOSSettings: jest.fn(),
  isAvailable: jest.fn()
}
