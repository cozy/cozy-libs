import 'mutationobserver-shim'
import React from 'react'
import { render } from '@testing-library/react'

import { CozyBar } from '../../api/models/applications'
import { WebviewIntentProvider } from './WebviewIntentProvider'
import { WebviewService } from '../../api/services/WebviewService'

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
})
