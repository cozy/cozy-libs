/* eslint-disable jest/no-focused-tests */
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { isMobile, isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import { useWebviewIntent } from 'cozy-intent'

import AppLike from '../../../../../test/components/AppLike'
import { FormDataProvider } from '../../../Contexts/FormDataProvider'
import { useFormData } from '../../../Hooks/useFormData'
import { useStepperDialog } from '../../../Hooks/useStepperDialog'
import ScanWrapper from '../ScanWrapper'

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
jest.mock('cozy-flags')
jest.mock('cozy-intent', () => ({
  ...jest.requireActual('cozy-intent'),
  useWebviewIntent: jest.fn()
}))
jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobile: jest.fn(),
  isFlagshipApp: jest.fn()
}))
jest.mock('../../../Hooks/useFormData')
jest.mock('../../../Hooks/useStepperDialog')
/* eslint-disable react/display-name */
jest.mock('../../../CompositeHeader/CompositeHeader', () => () => (
  <div data-testid="CompositeHeader" />
))
jest.mock('../../ScanResult/ScanResultDialog', () => () => (
  <div data-testid="ScanResultDialog" />
))
jest.mock('./ScanMobileActions', () => () => (
  <div data-testid="ScanMobileActions" />
))
jest.mock('./ScanFlagshipActions', () => () => (
  <div data-testid="ScanFlagshipActions" />
))
jest.mock('./ScanDesktopActions', () => () => (
  <div data-testid="ScanDesktopActions" />
))
/* eslint-enable react/display-name */

const setup = ({
  setFormData = jest.fn(),
  formData = mockFormData(),
  currentStep = mockCurrentStep(),
  currentStepIndex = 0,
  isMobileMock = false,
  isFlagshipAppMock = false,
  isScannerAvailable = false
} = {}) => {
  flag.mockReturnValue(true)
  isMobile.mockReturnValue(isMobileMock || isFlagshipAppMock)
  isFlagshipApp.mockReturnValue(isFlagshipAppMock)
  useWebviewIntent.mockReturnValue({
    call: jest.fn().mockResolvedValue(isScannerAvailable)
  })
  useFormData.mockReturnValue({
    setFormData,
    formData
  })
  useStepperDialog.mockReturnValue({
    currentStepIndex,
    currentDefinition: {},
    allCurrentSteps: []
  })

  return render(
    <AppLike>
      <FormDataProvider>
        <ScanWrapper currentStep={currentStep} />
      </FormDataProvider>
    </AppLike>
  )
}

describe('Scan component:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('ScanMobileActions component must be displayed if is on Mobile', () => {
    const { queryByTestId } = setup({ isMobileMock: true })

    expect(queryByTestId('ScanMobileActions')).toBeTruthy()
  })

  it('ScanMobileActions component must be displayed if is on flagship app but Scanner is unavailable', async () => {
    const { queryByTestId } = setup({
      isFlagshipAppMock: true,
      isScannerAvailable: false
    })

    await waitFor(() => {
      expect(queryByTestId('ScanMobileActions')).toBeTruthy()
    })
  })
  it('ScanFlagshipActions component must be displayed if is on flagship app & Scanner is available', async () => {
    const { queryByTestId } = setup({
      isFlagshipAppMock: true,
      isScannerAvailable: true
    })

    await waitFor(() => {
      expect(queryByTestId('ScanFlagshipActions')).toBeTruthy()
    })
  })

  it('ScanDesktopActions component must be displayed if is on Desktop', () => {
    const { queryByTestId } = setup()

    expect(queryByTestId('ScanDesktopActions')).toBeTruthy()
  })

  it('CompositeHeader component must be displayed if no file exists', () => {
    const { queryByTestId } = setup({
      formData: mockFormData({
        data: []
      })
    })

    expect(queryByTestId('CompositeHeader')).toBeTruthy()
  })

  it('CompositeHeader component must be displayed if no file of the current step exists', () => {
    const { queryByTestId } = setup({
      currentStepIndex: 0,
      currentStep: mockCurrentStep(),
      formData: mockFormData({
        data: [{ stepIndex: 2, file: mockFile({ name: 'test.pdf' }) }]
      })
    })

    expect(queryByTestId('CompositeHeader')).toBeTruthy()
  })

  it('ScanResultDialog component must be displayed if a file in the current step exists', () => {
    const { queryByTestId } = setup({
      currentStepIndex: 1,
      currentStep: mockCurrentStep(),
      formData: mockFormData({
        data: [{ stepIndex: 1, file: mockFile({ name: 'test.pdf' }) }]
      })
    })

    expect(queryByTestId('ScanResultDialog')).toBeTruthy()
  })
})
