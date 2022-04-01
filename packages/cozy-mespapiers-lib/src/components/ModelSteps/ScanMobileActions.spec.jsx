import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import ScanMobileActions from 'src/components/ModelSteps/ScanMobileActions'
import AppLike from 'test/components/AppLike'

const setup = ({ openFilePickerModal, onChangeFile } = {}) => {
  return render(
    <AppLike>
      <ScanMobileActions
        openFilePickerModal={
          openFilePickerModal ? openFilePickerModal : undefined
        }
        onChangeFile={onChangeFile ? onChangeFile : undefined}
      />
    </AppLike>
  )
}

describe('ScanMobileActions', () => {
  it('should called openFilePickerModalAction function', () => {
    const openFilePickerModalAction = jest.fn()
    const { getByTestId } = setup({
      openFilePickerModal: openFilePickerModalAction
    })

    const submitButton = getByTestId('selectPicFromCozy-btn')

    fireEvent.click(submitButton)

    expect(openFilePickerModalAction).toBeCalledTimes(1)
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
