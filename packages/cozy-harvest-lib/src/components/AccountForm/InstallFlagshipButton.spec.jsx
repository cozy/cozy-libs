import { render, fireEvent, screen } from '@testing-library/react'
import React from 'react'

import { isAndroid, isIOS } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { InstallFlagshipButton } from './InstallFlagshipButton'

jest.mock('cozy-device-helper', () => ({
  isAndroid: jest.fn(),
  isIOS: jest.fn()
}))

jest.mock('cozy-flags')

jest.mock('twake-i18n', () => ({
  useI18n: jest.fn(() => ({ t: key => key, lang: 'en' }))
}))

describe('InstallFlagshipButton', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<InstallFlagshipButton />)

    expect(
      screen.getByText('accountForm.installFlagship.label')
    ).toBeInTheDocument()
  })

  it('should open the download link in a new tab when clicked', () => {
    const mockWindowOpen = jest
      .spyOn(window, 'open')
      .mockImplementation(() => {})

    render(<InstallFlagshipButton />)

    fireEvent.click(screen.getByText('accountForm.installFlagship.label'))
    expect(mockWindowOpen).toHaveBeenCalledTimes(1)
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://cozy.io/en/download',
      '_blank'
    )
  })

  it('should open the Play Store when clicked on an Android device', () => {
    isAndroid.mockReturnValueOnce(true)
    const mockWindowOpen = jest
      .spyOn(window, 'open')
      .mockImplementation(() => {})

    render(<InstallFlagshipButton />)

    fireEvent.click(screen.getByText('accountForm.installFlagship.label'))
    expect(mockWindowOpen).toHaveBeenCalledTimes(1)
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://play.google.com/store/apps/details?id=io.cozy.flagship.mobile&hl=en',
      '_blank'
    )
  })

  it('should open the Play Store when clicked on an Android device with a custom id', () => {
    isAndroid.mockReturnValueOnce(true)
    flag.mockReturnValueOnce('playstore_custom_id')
    const mockWindowOpen = jest
      .spyOn(window, 'open')
      .mockImplementation(() => {})

    render(<InstallFlagshipButton />)

    fireEvent.click(screen.getByText('accountForm.installFlagship.label'))
    expect(mockWindowOpen).toHaveBeenCalledTimes(1)
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://play.google.com/store/apps/details?id=playstore_custom_id&hl=en',
      '_blank'
    )
  })

  it('should open the App Store when clicked on an iOS device', () => {
    isIOS.mockReturnValueOnce(true)
    const mockWindowOpen = jest
      .spyOn(window, 'open')
      .mockImplementation(() => {})

    render(<InstallFlagshipButton />)

    fireEvent.click(screen.getByText('accountForm.installFlagship.label'))
    expect(mockWindowOpen).toHaveBeenCalledTimes(1)
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://apps.apple.com/en/app/id1600636174',
      '_blank'
    )
  })

  it('should open the App Store when clicked on an iOS device with a custom id', () => {
    isIOS.mockReturnValueOnce(true)
    flag.mockReturnValueOnce('appstore_custom_id')
    const mockWindowOpen = jest
      .spyOn(window, 'open')
      .mockImplementation(() => {})

    render(<InstallFlagshipButton />)

    fireEvent.click(screen.getByText('accountForm.installFlagship.label'))
    expect(mockWindowOpen).toHaveBeenCalledTimes(1)
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://apps.apple.com/en/app/appstore_custom_id',
      '_blank'
    )
  })
})
