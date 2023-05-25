import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ScanDesktopActionsAlert from './ScanDesktopActionsAlert'
import AppLike from '../../../../../test/components/AppLike'

jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  hasQueryBeenLoaded: jest.fn()
}))

const setup = ({ onCloseFn = jest.fn() } = {}) => {
  return render(
    <AppLike>
      <ScanDesktopActionsAlert onClose={onCloseFn} />
    </AppLike>
  )
}

describe('ScanDesktopActionsAlert', () => {
  it('should display QRCodeModal modal when click on "Install the app" button', () => {
    const { getByText, getByTestId } = setup()
    const installAppButton = getByText('Install the app')

    fireEvent.click(installAppButton)

    const QRCodeModal = getByTestId('QRCodeModal')

    expect(QRCodeModal).toBeInTheDocument()
  })

  it('should call client.save when click on "No, thanks" button', () => {
    const onCloseFn = jest.fn()
    const { getByText } = setup({ onCloseFn })
    const hideButton = getByText('No, thanks')

    fireEvent.click(hideButton)

    expect(onCloseFn).toBeCalledTimes(1)
  })
})
