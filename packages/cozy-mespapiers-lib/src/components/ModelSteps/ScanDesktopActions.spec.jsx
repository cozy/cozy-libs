import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import ScanDesktopActions from 'src/components/ModelSteps/ScanDesktopActions'
import AppLike from 'test/components/AppLike'

const setup = ({ openFilePickerModal, onChangeFile } = {}) => {
  return render(
    <AppLike>
      <ScanDesktopActions
        openFilePickerModal={
          openFilePickerModal ? openFilePickerModal : undefined
        }
        onChangeFile={onChangeFile ? onChangeFile : undefined}
      />
    </AppLike>
  )
}

describe('ScanDesktopActions', () => {
  it('should called openFilePickerModalAction function', () => {
    const openFilePickerModalAction = jest.fn()
    const { getByTestId } = setup({
      openFilePickerModal: openFilePickerModalAction
    })

    const submitButton = getByTestId('selectPicFromCozy-btn')

    fireEvent.click(submitButton)

    expect(openFilePickerModalAction).toBeCalledTimes(1)
  })

  it('should have 1 input with type file attribute', () => {
    const { container } = setup()
    const inputFileButtons = container.querySelectorAll('input[type="file"]')

    expect(inputFileButtons).toHaveLength(1)
  })

  it('should called onChangeFileAction function', () => {
    const onChangeFileAction = jest.fn()
    const { getByTestId } = setup({
      onChangeFile: onChangeFileAction
    })

    const inputFileButton = getByTestId('importPicFromDesktop-btn')

    fireEvent.change(inputFileButton)
    expect(onChangeFileAction).toBeCalledTimes(1)
  })
})
