import React from 'react'
import { render, screen } from '@testing-library/react'
import 'mutationobserver-shim'

import { WebviewIntentProvider } from './WebviewIntentProvider'
import {
  mockWebviewWindow,
  mockChildHandshake,
  mockConnection,
  mockIsFlagshipApp,
  mockWebviewService
} from '../../tests/mocks'

// eslint-disable-next-line no-global-assign
window = mockWebviewWindow()

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
  })

  it('renders with no AA context', () => {
    mockIsFlagshipApp.mockReturnValue(false)

    const { queryByText } = render(
      <WebviewIntentProvider>Hello</WebviewIntentProvider>
    )

    expect(queryByText('Hello')).toBeDefined()
  })

  it('renders without injection', async () => {
    render(<WebviewIntentProvider>Hello</WebviewIntentProvider>)

    expect(await screen.findByText('Hello')).toBeDefined()
    expect(mockChildHandshake).toHaveBeenCalled()
  })

  it('renders with injection', async () => {
    render(
      <WebviewIntentProvider webviewService={mockWebviewService}>
        Hello
      </WebviewIntentProvider>
    )

    expect(await screen.findByText('Hello')).toBeDefined()
    expect(mockChildHandshake).not.toHaveBeenCalled()
  })
})
