import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ScanDesktopActions from './ScanDesktopActions'
import AppLike from '../../../../../test/components/AppLike'

const setup = ({ onOpenFilePickerModal, onChangeFile } = {}) => {
  return render(
    <AppLike>
      <ScanDesktopActions
        onOpenFilePickerModal={
          onOpenFilePickerModal ? onOpenFilePickerModal : undefined
        }
        onChangeFile={onChangeFile ? onChangeFile : undefined}
      />
    </AppLike>
  )
}

describe('ScanDesktopActions', () => {
  it('should called onOpenFilePickerModal function', () => {
    const onOpenFilePickerModal = jest.fn()
    const { getByTestId } = setup({
      onOpenFilePickerModal
    })

    const submitButton = getByTestId('selectPicFromCozy-btn')

    fireEvent.click(submitButton)

    expect(onOpenFilePickerModal).toBeCalledTimes(1)
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
