/* eslint-disable jest/no-focused-tests */
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { StepperDialogProvider } from 'components/Contexts/StepperDialogProvider'
import React from 'react'

import SubmitButton from './SubmitButton'
import AppLike from '../../../../test/components/AppLike'

const mockFormData = ({ metadata = {}, data = [], contacts = [] } = {}) => ({
  metadata,
  data,
  contacts
})

/* eslint-disable react/display-name */
jest.mock('./ConfirmReplaceFile', () => () => (
  <div data-testid="ConfirmReplaceFile" />
))
/* eslint-enable react/display-name */
// Allow to pass 'isReady' in StepperDialogProvider
jest.mock('../../../helpers/findPlaceholders', () => ({
  findPlaceholderByLabelAndCountry: arg => arg
}))

const setup = ({
  formData = mockFormData(),
  onSubmit = jest.fn(),
  disabled = false
} = {}) => {
  return render(
    <AppLike>
      <StepperDialogProvider>
        <SubmitButton
          formData={formData}
          onSubmit={onSubmit}
          disabled={disabled}
        />
      </StepperDialogProvider>
    </AppLike>
  )
}

describe('ContactDialog', () => {
  it('should submit when save button is clicked, if the file is from user device', async () => {
    const submitSpy = jest.fn()
    const mockFetchCurrentUser = jest.fn(() => ({ _id: '1234' }))
    const userDeviceFile = new File([{}], 'userDeviceFile')
    const { queryByTestId } = setup({
      formData: mockFormData({ data: [{ file: userDeviceFile }] }),
      onSubmit: submitSpy,
      mockFetchCurrentUser
    })

    await waitFor(() => {
      const btn = queryByTestId('ButtonSave')
      fireEvent.click(btn)

      expect(submitSpy).toBeCalledTimes(1)
    })
  })

  it('should not diplay ConfirmReplaceFile modal when save button is clicked, if the file is from User Device', async () => {
    const mockFetchCurrentUser = jest.fn(() => ({ _id: '1234' }))
    const userDeviceFile = new File([{}], 'userDeviceFile')
    const { findByTestId, queryByTestId } = setup({
      formData: mockFormData({ data: [{ file: userDeviceFile }] }),
      mockFetchCurrentUser
    })

    const btn = await findByTestId('ButtonSave')
    fireEvent.click(btn)

    expect(queryByTestId('ConfirmReplaceFile')).toBeNull()
  })

  it('should diplay ConfirmReplaceFile modal when save button is clicked, if the file is from Cozy Drive', async () => {
    const mockFormSubmit = jest.fn()
    const mockFetchCurrentUser = jest.fn(() => ({ _id: '1234' }))
    const cozyFile = new File([{}], 'cozyFile')
    cozyFile.from = 'cozy'
    const { findByTestId, queryByTestId } = setup({
      formData: mockFormData({ data: [{ file: cozyFile }] }),
      mockFetchCurrentUser,
      formSubmit: mockFormSubmit
    })

    const btn = await findByTestId('ButtonSave')
    fireEvent.click(btn)
    expect(mockFormSubmit).toBeCalledTimes(0)

    expect(queryByTestId('ConfirmReplaceFile')).toBeInTheDocument()
  })
})
