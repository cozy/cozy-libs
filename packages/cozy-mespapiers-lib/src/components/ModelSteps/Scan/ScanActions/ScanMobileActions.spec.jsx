import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ScanMobileActions from './ScanMobileActions'
import AppLike from '../../../../../test/components/AppLike'

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

    expect(inputFileButtons).toHaveLength(1)
  })

  it('should open InstallAppModal modal when click on takePic button', () => {
    const { getByTestId } = setup()

    const takePicButton = getByTestId('takePic-btn')

    fireEvent.click(takePicButton)

    const installAppModal = getByTestId('InstallAppModal')

    expect(installAppModal).toBeInTheDocument()
  })
})
