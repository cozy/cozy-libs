/* eslint-disable jest/no-focused-tests */
import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import ContactDialog from './ContactDialog'
import AppLike from '../../../test/components/AppLike'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { StepperDialogProvider } from '../Contexts/StepperDialogProvider'
import { useFormData } from '../Hooks/useFormData'
import { useStepperDialog } from '../Hooks/useStepperDialog'

const mockCurrentStep = { illustration: 'Account.svg', text: 'text of step' }
const mockFormData = ({ metadata = {}, data = [], contacts = [] } = {}) => ({
  metadata,
  data,
  contacts
})

jest.mock('../Hooks/useFormData')
jest.mock('../Hooks/useStepperDialog')
jest.mock('../../helpers/fetchCurrentUser', () => ({
  fetchCurrentUser: jest.fn()
}))
// Allow to pass 'isReady' in StepperDialogProvider
jest.mock('../../helpers/findPlaceholders', () => ({
  findPlaceholderByLabelAndCountry: arg => arg
}))
/* eslint-disable react/display-name */
jest.mock('./widgets/ConfirmReplaceFile', () => () => (
  <div data-testid="ConfirmReplaceFile" />
))
jest.mock('./widgets/SubmitButton', () => () => (
  <div data-testid="SubmitButton" />
))
/* eslint-enable react/display-name */

const setup = ({
  formData = mockFormData(),
  formSubmit = jest.fn(),
  onClose = jest.fn(),
  mockFetchCurrentUser = jest.fn(),
  isLastStep = jest.fn(() => false)
} = {}) => {
  useStepperDialog.mockReturnValue({
    currentDefinition: {},
    allCurrentSteps: [],
    isLastStep
  })
  fetchCurrentUser.mockImplementation(mockFetchCurrentUser)
  useFormData.mockReturnValue({
    formData,
    setFormData: jest.fn(),
    formSubmit
  })

  return render(
    <AppLike>
      <StepperDialogProvider>
        <FormDataProvider>
          <ContactDialog currentStep={mockCurrentStep} onClose={onClose} />
        </FormDataProvider>
      </StepperDialogProvider>
    </AppLike>
  )
}

describe('ContactDialog', () => {
  it('should have a SubmitButton if is the last step', async () => {
    const { getByTestId } = setup({
      isLastStep: jest.fn(() => true)
    })

    await waitFor(() => {
      expect(getByTestId('SubmitButton')).toBeInTheDocument()
    })
  })

  it('should not have a SubmitButton if is not the last step', async () => {
    const { queryByTestId } = setup({
      isLastStep: jest.fn(() => false)
    })
    await waitFor(() => {
      expect(queryByTestId('SubmitButton')).toBeNull()
    })
  })

  it('should call fetchCurrentUser once at mount', async () => {
    const mockFetchCurrentUser = jest.fn()
    setup({ mockFetchCurrentUser })
    await waitFor(() => {
      expect(mockFetchCurrentUser).toBeCalledTimes(1)
    })
  })
})
