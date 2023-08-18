import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import ScanResultDialog from './ScanResultDialog'
import AppLike from '../../../../test/components/AppLike'
import { FormDataProvider } from '../../Contexts/FormDataProvider'
import { useFormData } from '../../Hooks/useFormData'
import { useStepperDialog } from '../../Hooks/useStepperDialog'

const mockCurrentStep = ({ page = '', multipage = false } = {}) => ({
  page,
  multipage
})
const mockFile = ({ type = '', name = '' } = {}) => ({ type, name })
const mockFormData = ({ metadata = {}, data = [], contacts = [] } = {}) => ({
  metadata,
  data,
  contacts
})
jest.mock('../../Hooks/useStepperDialog')
jest.mock('../../Hooks/useFormData')

const setup = ({
  nextStep = jest.fn(),
  setFormData = jest.fn(),
  setCurrentFile = jest.fn(),
  currentStepIndex = 0,
  formData = mockFormData(),
  currentFile = mockFile(),
  currentStep = mockCurrentStep()
} = {}) => {
  useStepperDialog.mockReturnValue({
    currentStepIndex,
    nextStep,
    currentDefinition: {},
    allCurrentSteps: []
  })
  useFormData.mockReturnValue({
    setFormData,
    formData
  })

  return render(
    <AppLike>
      <FormDataProvider>
        <ScanResultDialog
          setCurrentFile={setCurrentFile}
          currentFile={currentFile}
          currentStep={currentStep}
        />
      </FormDataProvider>
    </AppLike>
  )
}

describe('AcquisitionResult component:', () => {
  beforeEach(() => {
    window.URL.createObjectURL = jest.fn()
    jest.resetAllMocks()
  })

  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('repeat button should not exist if the step is not multipage', () => {
    const { container } = setup({
      currentStep: mockCurrentStep({ multipage: false })
    })
    const btn = container.querySelector('[data-testid="repeat-button"]')

    expect(btn).toBeNull()
  })

  it('repeat button should exist if the step is multipage', () => {
    const { container } = setup({
      currentStep: mockCurrentStep({ multipage: true })
    })
    const btn = container.querySelector('[data-testid="repeat-button"]')

    expect(btn).toBeDefined()
  })

  describe('setCurrentFile', () => {
    it('should setCurrentFile must be called once with null when restarting the file selection', () => {
      const mockSetCurrentFile = jest.fn()
      const { getByTestId } = setup({ setCurrentFile: mockSetCurrentFile })

      const btn = getByTestId('retry-button')

      fireEvent.click(btn)

      expect(mockSetCurrentFile).toHaveBeenCalledWith(null)
      expect(mockSetCurrentFile).toHaveBeenCalledTimes(1)
    })

    it('should setCurrentFile must be called once with null when add more files', () => {
      const mockSetCurrentFile = jest.fn()
      const mockNextStep = jest.fn()
      const { getByTestId } = setup({
        nextStep: mockNextStep,
        setCurrentFile: mockSetCurrentFile,
        currentStep: mockCurrentStep({ multipage: true })
      })

      const btn = getByTestId('repeat-button')

      fireEvent.click(btn)

      expect(mockSetCurrentFile).toHaveBeenCalledWith(null)
      expect(mockSetCurrentFile).toHaveBeenCalledTimes(1)
      expect(mockNextStep).toHaveBeenCalledTimes(0)
    })
  })

  describe('nextStep', () => {
    it('should nextStep does not be called when add more files', () => {
      const mockNextStep = jest.fn()
      const { getByTestId } = setup({
        nextStep: mockNextStep,
        currentStep: mockCurrentStep({ multipage: true })
      })

      const btn = getByTestId('repeat-button')

      fireEvent.click(btn)

      expect(mockNextStep).toHaveBeenCalledTimes(0)
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

  describe('setFormData', () => {
    it('should setFormData must not be called when component is mounted if file already exists on same stepIndex', () => {
      const mockSetFormData = jest.fn()
      setup({
        setFormData: mockSetFormData,
        currentFile: mockFile({ name: 'test.pdf' }),
        currentStepIndex: 0,
        currentStep: mockCurrentStep(),
        formData: mockFormData({
          data: [{ stepIndex: 1, file: { name: 'test.pdf' } }]
        })
      })

      expect(mockSetFormData).toHaveBeenCalledTimes(0)
    })

    it('should setFormData must be called once when restarting the file selection', () => {
      const mockSetFormData = jest.fn()
      const { getByTestId } = setup({ setFormData: mockSetFormData })

      expect(mockSetFormData).toHaveBeenCalledTimes(0)

      const btn = getByTestId('retry-button')
      fireEvent.click(btn)

      expect(mockSetFormData).toHaveBeenCalledTimes(1)
    })
  })
})
