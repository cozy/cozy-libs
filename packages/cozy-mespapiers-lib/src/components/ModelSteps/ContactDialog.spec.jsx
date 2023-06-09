import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ContactDialog from './ContactDialog'
import AppLike from '../../../test/components/AppLike'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import { FormDataProvider } from '../Contexts/FormDataProvider'
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
/* eslint-disable react/display-name */
jest.mock('./widgets/ConfirmReplaceFile', () => () => (
  <div data-testid="ConfirmReplaceFile" />
))
/* eslint-enable react/display-name */

const setup = ({
  formData = mockFormData(),
  formSubmit = jest.fn(),
  onClose = jest.fn(),
  mockFetchCurrentUser = jest.fn()
} = {}) => {
  useStepperDialog.mockReturnValue({
    currentDefinition: {},
    allCurrentSteps: []
  })
  fetchCurrentUser.mockImplementation(mockFetchCurrentUser)
  useFormData.mockReturnValue({
    formData,
    setFormData: jest.fn(),
    formSubmit
  })

  return render(
    <AppLike>
      <FormDataProvider>
        <ContactDialog currentStep={mockCurrentStep} onClose={onClose} />
      </FormDataProvider>
    </AppLike>
  )
}

describe('ContactDialog', () => {
  it('should submit when save button is clicked, if the file is from user device', async () => {
    const mockFormSubmit = jest.fn()
    const mockFetchCurrentUser = jest.fn(() => ({ _id: '1234' }))
    const userDeviceFile = new File([{}], 'userDeviceFile')
    const { findByTestId } = setup({
      formData: mockFormData({ data: [{ file: userDeviceFile }] }),
      formSubmit: mockFormSubmit,
      mockFetchCurrentUser
    })

    const btn = await findByTestId('ButtonSave')
    fireEvent.click(btn)

    expect(mockFormSubmit).toBeCalledTimes(1)
  })

  it('should not submit when save button is clicked, if the file is from Cozy Drive', () => {
    const mockFormSubmit = jest.fn()
    const cozyFile = new Blob()
    const { getByTestId } = setup({
      formData: mockFormData({ data: [{ file: cozyFile }] }),
      formSubmit: mockFormSubmit
    })

    const btn = getByTestId('ButtonSave')
    fireEvent.click(btn)

    expect(mockFormSubmit).toBeCalledTimes(0)
  })

  it('should call fetchCurrentUser once at mount', () => {
    const mockFetchCurrentUser = jest.fn()
    setup({ mockFetchCurrentUser })

    expect(mockFetchCurrentUser).toBeCalledTimes(1)
  })

  it('should not diplay ConfirmReplaceFile modal when save button is clicked, if the file is from User Device', () => {
    const mockFetchCurrentUser = jest.fn(() => ({ _id: '1234' }))
    const userDeviceFile = new File([{}], 'userDeviceFile')
    const { getByTestId, queryByTestId } = setup({
      formData: mockFormData({ data: [{ file: userDeviceFile }] }),
      mockFetchCurrentUser
    })

    const btn = getByTestId('ButtonSave')
    fireEvent.click(btn)

    expect(queryByTestId('ConfirmReplaceFile')).toBeNull()
  })

  it('should diplay ConfirmReplaceFile modal when save button is clicked, if the file is from Cozy Drive', async () => {
    const mockFetchCurrentUser = jest.fn(() => ({ _id: '1234' }))
    const cozyFile = new Blob()
    const { findByTestId, getByTestId } = setup({
      formData: mockFormData({ data: [{ file: cozyFile }] }),
      mockFetchCurrentUser
    })

    const btn = await findByTestId('ButtonSave')
    fireEvent.click(btn)

    expect(getByTestId('ConfirmReplaceFile'))
  })
})
