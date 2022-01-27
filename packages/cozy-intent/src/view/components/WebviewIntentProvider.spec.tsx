import React from 'react'
import { render, screen } from '@testing-library/react'
import 'mutationobserver-shim'

import { WebviewIntentProvider } from './WebviewIntentProvider'
import {
  getMockWebviewWindow,
  mockChildHandshake,
  mockConnection,
  mockIsFlagshipApp,
  mockWebviewService
} from '../../tests/mocks'

// eslint-disable-next-line no-global-assign
window = getMockWebviewWindow()

jest.mock('cozy-device-helper', () => ({
  isFlagshipApp: jest.fn()
}))

jest.mock('post-me', () => ({
  ChildHandshake: jest.fn(() => Promise.resolve(mockConnection))
}))

describe('WebviewIntentProvider', () => {
  beforeEach(() => {
    mockIsFlagshipApp.mockImplementation(() => true)
  })

  afterEach(() => {
    mockChildHandshake.mockClear()
    mockIsFlagshipApp.mockClear()
  })

  it('renders with no AA context', async () => {
    mockIsFlagshipApp.mockImplementation(() => false)

    render(<WebviewIntentProvider>Hello</WebviewIntentProvider>)

    expect(await screen.findByText('Hello')).toBeDefined()
  })

  it('renders without injection', async () => {
    render(<WebviewIntentProvider>Hello</WebviewIntentProvider>)

    expect(await screen.findByText('Hello')).toBeDefined()
    expect(mockChildHandshake).toBeCalledTimes(1)
  })

  it('renders with injection', async () => {
    render(
      <WebviewIntentProvider webviewService={mockWebviewService}>
        Hello
      </WebviewIntentProvider>
    )

    expect(await screen.findByText('Hello')).toBeDefined()
    expect(mockChildHandshake).toBeCalledTimes(0)
  })
})
