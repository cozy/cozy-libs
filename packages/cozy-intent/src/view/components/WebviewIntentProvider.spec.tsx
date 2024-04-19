import 'mutationobserver-shim'
import React from 'react'
import { render } from '@testing-library/react'

import {
  mockChildHandshake,
  mockConnection,
  mockCozyBar,
  mockSetWebviewContext,
  mockWebviewService,
  mockWebviewWindow
} from '../../../tests'
import { CozyBar, WebviewService } from '../../api'
import { WebviewIntentProvider } from '../../view'

// eslint-disable-next-line no-global-assign
window = mockWebviewWindow()

declare const global: {
  cozy: { bar: CozyBar['bar']; flagship: boolean }
  ReactNativeWebView: unknown
}

global.cozy = { bar: mockCozyBar, flagship: true }

jest.mock('post-me', () => ({
  ...jest.requireActual('post-me'),
  debug: (): jest.Mock => jest.fn(),
  ChildHandshake: jest.fn(() => Promise.resolve(mockConnection))
}))

describe('WebviewIntentProvider', () => {
  afterEach(() => {
    mockChildHandshake.mockClear()
    mockSetWebviewContext.mockClear()
    global.cozy.flagship = true
  })

  it('renders with no AA context', async () => {
    global.cozy.flagship = false

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
    global.cozy.bar = undefined

    const { findByText } = render(
      <WebviewIntentProvider webviewService={mockWebviewService}>
        Hello
      </WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetWebviewContext).not.toHaveBeenCalled()
  })

  it('does not try to set cozy-bar context if cozy-bar does not exist when not provided with a context', async () => {
    global.cozy.bar = undefined

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetWebviewContext).not.toHaveBeenCalled()
  })

  it('sets cozy-bar context if cozy-bar does exist when provided with a context', async () => {
    global.cozy.bar = mockCozyBar

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
    global.cozy.bar = mockCozyBar

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
    expect(mockSetWebviewContext).toBeCalledWith(expect.any(WebviewService))
    expect(mockSetWebviewContext).toBeCalledTimes(1)
  })

  it('does not throw if cozy-bar api is outdated', async () => {
    global.cozy.bar = { setWebviewContext: undefined }

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
    global.ReactNativeWebView = undefined

    const { findByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(await findByText('Hello')).toBeTruthy()
  })
})
