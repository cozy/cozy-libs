import { fireEvent, render, waitFor } from '@testing-library/react'
import { StepperDialogProvider } from 'components/Contexts/StepperDialogProvider'
import React from 'react'

import ScanFlagshipActions from './ScanFlagshipActions'
import AppLike from '../../../../../test/components/AppLike'

// Allow to pass 'isReady' in StepperDialogProvider
jest.mock('../../../../helpers/findPlaceholders', () => ({
  findPlaceholderByLabelAndCountry: arg => arg
}))

const setup = ({
  onOpenFilePickerModal,
  onChangeFile,
  onOpenFlagshipScan
} = {}) => {
  return render(
    <AppLike>
      <StepperDialogProvider>
        <ScanFlagshipActions
          onOpenFilePickerModal={
            onOpenFilePickerModal ? onOpenFilePickerModal : undefined
          }
          onChangeFile={onChangeFile ? onChangeFile : undefined}
          onOpenFlagshipScan={
            onOpenFlagshipScan ? onOpenFlagshipScan : undefined
          }
        />
      </StepperDialogProvider>
    </AppLike>
  )
}

describe('ScanFlagshipActions', () => {
  it('should called onOpenFilePickerModal function', async () => {
    const onOpenFilePickerModal = jest.fn()
    const { getByTestId } = setup({
      onOpenFilePickerModal
    })

    await waitFor(() => {
      const submitButton = getByTestId('selectPicFromCozy-btn')

      fireEvent.click(submitButton)

      expect(onOpenFilePickerModal).toBeCalledTimes(1)
    })
  })

  it('should have one input with type file attribute', async () => {
    const { container } = setup()

    await waitFor(() => {
      const inputFileButtons = container.querySelectorAll('input[type="file"]')

      expect(inputFileButtons).toHaveLength(1)
    })
  })

  it('should called onOpenFlagshipScan function', async () => {
    const onOpenFlagshipScan = jest.fn()
    const { getByTestId } = setup({
      onOpenFlagshipScan
    })

    await waitFor(() => {
      const importPicFromFlagshipScanButton = getByTestId(
        'importPicFromFlagshipScan-btn'
      )

      fireEvent.click(importPicFromFlagshipScanButton)

      expect(onOpenFlagshipScan).toBeCalledTimes(1)
    })
  })
})
