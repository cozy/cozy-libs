import { isFlagshipApp } from 'cozy-device-helper'
import { ChildHandshake } from 'post-me'

import { WebviewWindow } from '../api/models/environments'
import { WebviewMessenger } from '../api/services/WebviewMessenger'
import { WebviewService } from '../api/services/WebviewService'

export class MockWebviewMessenger extends WebviewMessenger {}

export class MockWebviewService extends WebviewService {}

type JestWindow = Window & typeof globalThis & WebviewWindow

export const getMockWebviewWindow = (): JestWindow => {
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
