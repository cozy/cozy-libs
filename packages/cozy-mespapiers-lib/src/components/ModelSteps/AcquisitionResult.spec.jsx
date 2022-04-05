'use strict'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import AppLike from '../../../test/components/AppLike'
import AcquisitionResult from './AcquisitionResult'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { useStepperDialog } from '../Hooks/useStepperDialog'

const mockCurrentStep = { page: '', multipage: false }
const mockFile = { type: '' }

const setup = ({
  nextStep = jest.fn(),
  setFile = jest.fn(),
  file = mockFile,
  currentStep = mockCurrentStep
} = {}) => {
  useStepperDialog.mockReturnValue({ nextStep })

  return render(
    <AppLike>
      <FormDataProvider>
        <AcquisitionResult
          setFile={setFile}
          file={file}
          currentStep={currentStep}
        />
      </FormDataProvider>
    </AppLike>
  )
}
jest.mock('../Hooks/useStepperDialog')

describe('AcquisitionResult component:', () => {
  window.URL.createObjectURL = jest.fn()

  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should setFile must be called once with null when restarting the file selection', () => {
    const mockSetFile = jest.fn()
    const { getByTestId } = setup({ setFile: mockSetFile })

    const btn = getByTestId('retry-button')

    fireEvent.click(btn)

    expect(mockSetFile).toHaveBeenCalledWith(null)
    expect(mockSetFile).toHaveBeenCalledTimes(1)
  })

  it('should setFile must be called once with null when add more files', () => {
    const mockSetFile = jest.fn()
    const { getByTestId } = setup({
      setFile: mockSetFile,
      currentStep: { page: '', multipage: true }
    })

    const btn = getByTestId('repeat-button')

    fireEvent.click(btn)

    expect(mockSetFile).toHaveBeenCalledWith(null)
    expect(mockSetFile).toHaveBeenCalledTimes(1)
  })

  it('should nextStep must be called when next button is clicked', () => {
    const nextStep = jest.fn()
    const { getByTestId } = setup({
      nextStep
    })

    const btn = getByTestId('next-button')

    fireEvent.click(btn)

    expect(nextStep).toHaveBeenCalledTimes(1)
  })

  it('should nextStep must be called when Enter key is pressed', () => {
    const nextStep = jest.fn()
    setup({ nextStep })

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter', keyCode: 13 })

    expect(nextStep).toHaveBeenCalledTimes(1)
  })
})
