import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ScanMobileActions from './ScanMobileActions'
import AppLike from '../../../test/components/AppLike'

const setup = ({ onOpenFilePickerModal, onChangeFile } = {}) => {
  return render(
    <AppLike>
      <ScanMobileActions
        onOpenFilePickerModal={
          onOpenFilePickerModal ? onOpenFilePickerModal : undefined
        }
        onChangeFile={onChangeFile ? onChangeFile : undefined}
      />
    </AppLike>
  )
}

describe('ScanMobileActions', () => {
  it('should called onOpenFilePickerModal function', () => {
    const onOpenFilePickerModal = jest.fn()
    const { getByTestId } = setup({
      onOpenFilePickerModal
    })

    const submitButton = getByTestId('selectPicFromCozy-btn')

    fireEvent.click(submitButton)

    expect(onOpenFilePickerModal).toBeCalledTimes(1)
  })

  it('should have 2 inputs with type file attribute', () => {
    const { container } = setup()
    const inputFileButtons = container.querySelectorAll('input[type="file"]')

    expect(inputFileButtons).toHaveLength(2)
  })

  it('should called onChangeFileAction function', () => {
    const onChangeFileAction = jest.fn()
    const { getByTestId } = setup({ onChangeFile: onChangeFileAction })

    const takePicButton = getByTestId('takePic-btn')
    const importPicFromMobileButton = getByTestId('importPicFromMobile-btn')

    fireEvent.change(takePicButton)
    expect(onChangeFileAction).toBeCalledTimes(1)

    jest.clearAllMocks()

    fireEvent.change(importPicFromMobileButton)
    expect(onChangeFileAction).toBeCalledTimes(1)
  })
})
