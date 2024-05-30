import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import ScanResultDialog from './ScanResultDialog'
import AppLike from '../../../../test/components/AppLike'
import { FLAGSHIP_SCAN_TEMP_FILENAME } from '../../../constants/const'
import { isFlagshipOCRAvailable } from '../../../helpers/isFlagshipOCRAvailable'
import { FormDataProvider } from '../../Contexts/FormDataProvider'
import { StepperDialogProvider } from '../../Contexts/StepperDialogProvider'
import { useFormData } from '../../Hooks/useFormData'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import { getAttributesFromOcr } from '../helpers'

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
jest.mock('../../../helpers/isFlagshipOCRAvailable', () => ({
  ...jest.requireActual('../../../helpers/isFlagshipOCRAvailable'),
  isFlagshipOCRAvailable: jest.fn()
}))
jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  makeMetadataFromOcr: jest.fn(),
  getAttributesFromOcr: jest.fn()
}))
// Allow to pass 'isReady' in StepperDialogProvider
jest.mock('../../../helpers/findPlaceholders', () => ({
  findPlaceholderByLabelAndCountry: arg => arg
}))

const setup = ({
  nextStep = jest.fn(),
  isLastStep = jest.fn(),
  setFormData = jest.fn(),
  setCurrentFile = jest.fn(),
  currentStepIndex = 0,
  allCurrentSteps = [],
  currentDefinition = {},
  formData = mockFormData(),
  currentFile = mockFile(),
  currentStep = mockCurrentStep(),
  mockIsFlagshipOCRAvailable = false,
  mockGetAttributesFromOcr = jest.fn()
} = {}) => {
  getAttributesFromOcr.mockImplementation(mockGetAttributesFromOcr)
  isFlagshipOCRAvailable.mockReturnValue(mockIsFlagshipOCRAvailable)
  useStepperDialog.mockReturnValue({
    currentStepIndex,
    nextStep,
    isLastStep,
    currentDefinition,
    allCurrentSteps
  })
  useFormData.mockReturnValue({
    setFormData,
    formData
  })

  return render(
    <AppLike>
      <StepperDialogProvider>
        <FormDataProvider>
          <ScanResultDialog
            setCurrentFile={setCurrentFile}
            currentFile={currentFile}
            currentStep={currentStep}
          />
        </FormDataProvider>
      </StepperDialogProvider>
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

  it('repeat button should not exist if the step is not multipage', async () => {
    const { queryByTestId } = setup({
      currentStep: mockCurrentStep({ multipage: false })
    })

    await waitFor(() => {
      const btn = queryByTestId('repeat-button')

      expect(btn).toBeNull()
    })
  })

  it('repeat button should exist if the step is multipage', () => {
    const { container } = setup({
      currentStep: mockCurrentStep({ multipage: true })
    })
    const btn = container.querySelector('[data-testid="repeat-button"]')

    expect(btn).toBeDefined()
  })

  describe('setCurrentFile', () => {
    it('should setCurrentFile must be called once with null when restarting the file selection', async () => {
      const mockSetCurrentFile = jest.fn()
      const { getByTestId } = setup({ setCurrentFile: mockSetCurrentFile })

      await waitFor(() => {
        const btn = getByTestId('retry-button')

        fireEvent.click(btn)

        expect(mockSetCurrentFile).toHaveBeenCalledWith(null)
        expect(mockSetCurrentFile).toHaveBeenCalledTimes(1)
      })
    })

    it('should setCurrentFile must be called once with null when add more files', async () => {
      const mockSetCurrentFile = jest.fn()
      const mockNextStep = jest.fn()
      const { getByTestId } = setup({
        nextStep: mockNextStep,
        setCurrentFile: mockSetCurrentFile,
        currentStep: mockCurrentStep({ multipage: true })
      })

      await waitFor(() => {
        const btn = getByTestId('repeat-button')

        fireEvent.click(btn)

        expect(mockSetCurrentFile).toHaveBeenCalledWith(null)
        expect(mockSetCurrentFile).toHaveBeenCalledTimes(1)
        expect(mockNextStep).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('nextStep', () => {
    it('should nextStep does not be called when add more files', async () => {
      const mockNextStep = jest.fn()
      const { getByTestId } = setup({
        nextStep: mockNextStep,
        currentStep: mockCurrentStep({ multipage: true })
      })

      await waitFor(() => {
        const btn = getByTestId('repeat-button')

        fireEvent.click(btn)

        expect(mockNextStep).toHaveBeenCalledTimes(0)
      })
    })

    it('should nextStep must be called when next button is clicked', async () => {
      const nextStep = jest.fn()
      const { getByTestId } = setup({
        nextStep
      })

      await waitFor(() => {
        const btn = getByTestId('next-button')

        fireEvent.click(btn)

        expect(nextStep).toHaveBeenCalledTimes(1)
      })
    })

    it('should nextStep must be called when Enter key is pressed', async () => {
      const nextStep = jest.fn()
      setup({ nextStep })

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'Enter', code: 'Enter', keyCode: 13 })

        expect(nextStep).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('setFormData', () => {
    it('should setFormData must not be called when component is mounted if file already exists on same stepIndex', async () => {
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

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledTimes(0)
      })
    })

    it('should setFormData must be called once when restarting the file selection', async () => {
      const mockSetFormData = jest.fn()
      const { getByTestId } = setup({ setFormData: mockSetFormData })

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledTimes(0)

        const btn = getByTestId('retry-button')
        fireEvent.click(btn)
        expect(mockSetFormData).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('OCR', () => {
    describe('On flagship app and OCR available', () => {
      it('should not call the OCR process if the file has not passed through the flagship scanner', async () => {
        const mockGetAttributesFromOcr = jest.fn()
        const { getByTestId } = setup({
          currentFile: mockFile({ name: 'test.pdf' }),
          mockIsFlagshipOCRAvailable: true,
          isLastStep: jest.fn(() => true),
          currentDefinition: { ocrAttributes: [] },
          allCurrentSteps: [{ isDisplayed: 'ocr' }]
        })
        await waitFor(() => {
          const btn = getByTestId('next-button')
          fireEvent.click(btn)

          expect(mockGetAttributesFromOcr).toBeCalledTimes(0)
        })
      })

      it('should call the OCR process if the file has passed through the flagship scanner', async () => {
        const mockGetAttributesFromOcr = jest.fn()
        const { findByTestId } = setup({
          currentFile: mockFile({ name: FLAGSHIP_SCAN_TEMP_FILENAME }),
          mockIsFlagshipOCRAvailable: true,
          isLastStep: jest.fn(() => true),
          mockGetAttributesFromOcr,
          currentDefinition: { ocrAttributes: [] },
          allCurrentSteps: [{ isDisplayed: 'ocr' }]
        })

        const btn = await findByTestId('next-button')
        fireEvent.click(btn)

        waitFor(() => {
          expect(mockGetAttributesFromOcr).toBeCalledTimes(1)
        })
      })
    })
  })
})
