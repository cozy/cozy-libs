import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { StepperDialogProvider } from 'components/Contexts/StepperDialogProvider'
import React from 'react'

import flag from 'cozy-flags'

import ScanMobileActions from './ScanMobileActions'
import AppLike from '../../../../../test/components/AppLike'

jest.mock('cozy-flags')

// Allow to pass 'isReady' in StepperDialogProvider
jest.mock('../../../../helpers/findPlaceholders', () => ({
  findPlaceholderByLabelAndCountry: arg => arg
}))

const setup = ({
  onOpenFilePickerModal,
  onChangeFile,
  flagEnabled = false
} = {}) => {
  flag.mockReturnValue(flagEnabled)
  return render(
    <AppLike>
      <StepperDialogProvider>
        <ScanMobileActions
          onOpenFilePickerModal={
            onOpenFilePickerModal ? onOpenFilePickerModal : undefined
          }
          onChangeFile={onChangeFile ? onChangeFile : undefined}
        />
      </StepperDialogProvider>
    </AppLike>
  )
}

describe('ScanMobileActions', () => {
  it('should called onOpenFilePickerModal function', async () => {
    const onOpenFilePickerModal = jest.fn()
    const { findByTestId } = setup({
      flagEnabled: true,
      onOpenFilePickerModal
    })

    const submitButton = await findByTestId('selectPicFromCozy-btn')

    fireEvent.click(submitButton)

    expect(onOpenFilePickerModal).toBeCalledTimes(1)
  })

  it('should have 2 inputs with type file attribute', async () => {
    const { container } = setup()
    await waitFor(() => {
      const inputFileButtons = container.querySelectorAll('input[type="file"]')

      expect(inputFileButtons).toHaveLength(1)
    })
  })

  it('should open InstallAppModal modal when click on takePic button', async () => {
    const { findByTestId } = setup()

    const takePicButton = await findByTestId('takePic-btn')

    fireEvent.click(takePicButton)

    const installAppModal = await findByTestId('InstallAppModal')

    expect(installAppModal).toBeInTheDocument()
  })

  it('should open InstallAppModal if context flag is false', async () => {
    const { findByTestId } = setup({ flagEnabled: false })

    const takePicButton = await findByTestId('takePic-btn')

    fireEvent.click(takePicButton)

    const installAppModal = await findByTestId('InstallAppModal')

    expect(installAppModal).toBeInTheDocument()
  })

  it('should not open InstallAppModal if context flag is true', async () => {
    const { findByTestId, queryByTestId } = setup({ flagEnabled: true })

    const takePicButton = await findByTestId('takePic-btn')

    fireEvent.click(takePicButton)

    const installAppModal = queryByTestId('InstallAppModal')

    expect(installAppModal).toBeNull()
  })
})
