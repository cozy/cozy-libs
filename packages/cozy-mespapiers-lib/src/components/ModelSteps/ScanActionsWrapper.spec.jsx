/* eslint-disable jest/no-focused-tests */
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { isMobile, isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'

import ScanWrapper from './ScanWrapper'
import AppLike from '../../../test/components/AppLike'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { useFormData } from '../Hooks/useFormData'

const mockCurrentStep = ({
  page = '',
  multipage = false,
  stepIndex = 0
} = {}) => ({ page, multipage, stepIndex })
const mockFile = ({ type = '', name = '' } = {}) => ({ type, name })
const mockFormData = ({ metadata = {}, data = [], contacts = [] } = {}) => ({
  metadata,
  data,
  contacts
})
jest.mock('cozy-intent', () => ({
  ...jest.requireActual('cozy-intent'),
  useWebviewIntent: jest.fn()
}))
jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobile: jest.fn(),
  isFlagshipApp: jest.fn()
}))
jest.mock('../Hooks/useFormData')
/* eslint-disable react/display-name */
jest.mock('../CompositeHeader/CompositeHeader', () => () => (
  <div data-testid="CompositeHeader" />
))
jest.mock('./AcquisitionResult', () => () => (
  <div data-testid="AcquisitionResult" />
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
  isMobileMock = false,
  isFlagshipAppMock = false,
  isScannerAvailable = false
} = {}) => {
  isMobile.mockReturnValue(isMobileMock || isFlagshipAppMock)
  isFlagshipApp.mockReturnValue(isFlagshipAppMock)
  useWebviewIntent.mockReturnValue({
    call: jest.fn().mockResolvedValue(isScannerAvailable)
  })
  useFormData.mockReturnValue({
    setFormData,
    formData
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
      currentStep: mockCurrentStep({ stepIndex: 1 }),
      formData: mockFormData({
        data: [{ stepIndex: 2, file: mockFile({ name: 'test.pdf' }) }]
      })
    })

    expect(queryByTestId('CompositeHeader')).toBeTruthy()
  })

  it('AcquisitionResult component must be displayed if a file in the current step exists', () => {
    const { queryByTestId } = setup({
      currentStep: mockCurrentStep({ stepIndex: 1 }),
      formData: mockFormData({
        data: [{ stepIndex: 1, file: mockFile({ name: 'test.pdf' }) }]
      })
    })

    expect(queryByTestId('AcquisitionResult')).toBeTruthy()
  })
})
