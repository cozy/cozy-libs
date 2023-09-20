import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { RunningAlert } from './RunningAlert'

// Mock the isFlagshipApp function for easier testing
const mockIsFlagshipApp = jest.fn()

jest.mock('cozy-device-helper', () => ({
  isFlagshipApp: (): unknown => mockIsFlagshipApp()
}))

// Mock the translation hook with distinct strings
jest.mock('cozy-ui/transpiled/react/providers/I18n', () => ({
  useI18n: (): {
    t: jest.Mock
  } => ({ t: jest.fn().mockImplementation(key => key as string) })
}))

describe('RunningAlert', () => {
  it('renders correctly when isFlagshipApp returns true', () => {
    mockIsFlagshipApp.mockReturnValue(true)

    const { getByText } = render(<RunningAlert />)

    // We're now using the translation keys as text
    expect(
      getByText('card.launchTrigger.runningAlert.title')
    ).toBeInTheDocument()
    expect(
      getByText('card.launchTrigger.runningAlert.body')
    ).toBeInTheDocument()
  })

  it('does not render when isFlagshipApp returns false', () => {
    mockIsFlagshipApp.mockReturnValue(false)

    const { queryByText } = render(<RunningAlert />)

    // We're now using the translation key as text
    expect(queryByText('card.launchTrigger.runningAlert.title')).toBeNull()
  })

  it('hides the alert when the button is clicked', () => {
    mockIsFlagshipApp.mockReturnValue(true)

    const { getByText, queryByText } = render(<RunningAlert />)

    // We're now using the translation key as text for the button
    fireEvent.click(getByText('card.launchTrigger.runningAlert.button'))

    // We're now using the translation key as text
    expect(queryByText('card.launchTrigger.runningAlert.title')).toBeNull()
  })
})
