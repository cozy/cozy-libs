import { ChildHandshake } from 'post-me'

import { isFlagshipApp } from 'cozy-device-helper'

import { WebviewMessenger } from '../api/services/WebviewMessenger'
import { WebviewService } from '../api/services/WebviewService'
import { WebviewWindow } from '../api/models/environments'

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

export const mockConnection = {
  localHandle: jest.fn(),
  remoteHandle: jest.fn(),
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
