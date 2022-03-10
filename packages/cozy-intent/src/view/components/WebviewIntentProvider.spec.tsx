import 'mutationobserver-shim'
import React from 'react'
import { render } from '@testing-library/react'

import { CozyBar } from '../../api/models/applications'
import { WebviewIntentProvider } from './WebviewIntentProvider'
import { WebviewService } from '../../api/services/WebviewService'
import { WebviewWindow } from '../../api/models/environments'
import {
  mockChildHandshake,
  mockConnection,
  mockCozyBar,
  mockIsFlagshipApp,
  mockSetWebviewContext,
  mockWebviewService,
  mockWebviewWindow
} from '../../tests/mocks'

// eslint-disable-next-line no-global-assign
window = mockWebviewWindow()

declare const global: {
  cozy?: CozyBar
}

global.cozy = mockCozyBar

jest.mock('cozy-device-helper', () => ({
  isFlagshipApp: jest.fn()
}))

jest.mock('post-me', () => ({
  ChildHandshake: jest.fn(() => Promise.resolve(mockConnection))
}))

describe('WebviewIntentProvider', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => null)
    mockIsFlagshipApp.mockReturnValue(true)
  })

  afterEach(() => {
    mockChildHandshake.mockClear()
    mockIsFlagshipApp.mockClear()
    mockSetWebviewContext.mockClear()
  })

  it('renders with no AA context', async () => {
    mockIsFlagshipApp.mockReturnValue(false)

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeDefined()
  })

  it('renders without injection', async () => {
    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeDefined()
    expect(mockChildHandshake).toHaveBeenCalled()
  })

  it('renders with injection', async () => {
    const { findByText } = render(
      <WebviewIntentProvider webviewService={mockWebviewService}>
        Hello
      </WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeDefined()
    expect(mockChildHandshake).not.toHaveBeenCalled()
  })

  it('does not try to set cozy-bar context if cozy-bar does not exist when provided with a context', async () => {
    global.cozy = undefined

    const { findByText } = render(
      <WebviewIntentProvider webviewService={mockWebviewService}>
        Hello
      </WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetWebviewContext).not.toHaveBeenCalled()
  })

  it('does not try to set cozy-bar context if cozy-bar does not exist when not provided with a context', async () => {
    global.cozy = undefined

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetWebviewContext).not.toHaveBeenCalled()
  })

  it('sets cozy-bar context if cozy-bar does exist when provided with a context', async () => {
    global.cozy = mockCozyBar

    const { findByText } = render(
      <WebviewIntentProvider webviewService={mockWebviewService}>
        Hello
      </WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetWebviewContext).toHaveBeenCalledWith(mockWebviewService)
    expect(mockSetWebviewContext).toBeCalledTimes(1)
  })

  it('sets cozy-bar context if cozy-bar does exist when not provided with a context', async () => {
    global.cozy = mockCozyBar

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetWebviewContext).toBeCalledWith(expect.any(WebviewService))
    expect(mockSetWebviewContext).toBeCalledTimes(1)
  })

  it('does not throw if cozy-bar api is outdated', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    global.cozy!.bar!.setWebviewContext = undefined

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
  })

  it('should allow cozy-bar v8 to inject callback', async () => {
    const mockSetBarContext = jest.fn()
    const { findByText } = render(
      <WebviewIntentProvider setBarContext={mockSetBarContext}>
        Hello
      </WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetBarContext).toBeCalledWith(expect.any(WebviewService))
    expect(mockSetBarContext).toBeCalledTimes(1)
  })

  it('does not throw in a flagship app context that has no RN API available', async () => {
    mockIsFlagshipApp.mockReturnValue(true)
    ;((window as unknown as WebviewWindow).ReactNativeWebView as unknown) =
      undefined

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
  })
})
