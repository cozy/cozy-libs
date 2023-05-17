import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ScanFlagshipActions from './ScanFlagshipActions'
import AppLike from '../../../test/components/AppLike'

const setup = ({
  onOpenFilePickerModal,
  onChangeFile,
  onOpenFlagshipScan
} = {}) => {
  return render(
    <AppLike>
      <ScanFlagshipActions
        onOpenFilePickerModal={
          onOpenFilePickerModal ? onOpenFilePickerModal : undefined
        }
        onChangeFile={onChangeFile ? onChangeFile : undefined}
        onOpenFlagshipScan={onOpenFlagshipScan ? onOpenFlagshipScan : undefined}
      />
    </AppLike>
  )
}

describe('ScanFlagshipActions', () => {
  it('should called onOpenFilePickerModal function', () => {
    const onOpenFilePickerModal = jest.fn()
    const { getByTestId } = setup({
      onOpenFilePickerModal
    })

    const submitButton = getByTestId('selectPicFromCozy-btn')

    fireEvent.click(submitButton)

    expect(onOpenFilePickerModal).toBeCalledTimes(1)
  })

  it('should have one input with type file attribute', () => {
    const { container } = setup()
    const inputFileButtons = container.querySelectorAll('input[type="file"]')

    expect(inputFileButtons).toHaveLength(1)
  })

  it('should called onOpenFlagshipScan function', () => {
    const onOpenFlagshipScan = jest.fn()
    const { getByTestId } = setup({
      onOpenFlagshipScan
    })

    const importPicFromFlagshipScanButton = getByTestId(
      'importPicFromFlagshipScan-btn'
    )

    fireEvent.click(importPicFromFlagshipScanButton)

    expect(onOpenFlagshipScan).toBeCalledTimes(1)
  })
})
