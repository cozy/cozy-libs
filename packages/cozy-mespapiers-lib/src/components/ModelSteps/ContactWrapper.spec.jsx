import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import AppLike from '../../../test/components/AppLike'
import ContactWrapper from './ContactWrapper'
import { FormDataProvider } from '../Contexts/FormDataProvider'
import { useFormData } from '../Hooks/useFormData'

const mockCurrentStep = { illustration: 'Account.svg', text: 'text of step' }
const mockFormData = ({ metadata = {}, data = [], contacts = [] } = {}) => ({
  metadata,
  data,
  contacts
})

jest.mock('../Hooks/useFormData')
/* eslint-disable react/display-name */
jest.mock('./widgets/ConfirmReplaceFile', () => () => (
  <div data-testid="ConfirmReplaceFile" />
))
jest.mock('./ContactList', () => () => <div data-testid="ContactList" />)
/* eslint-enable react/display-name */

const setup = ({
  formData = mockFormData(),
  formSubmit = jest.fn(),
  onClose = jest.fn()
} = {}) => {
  useFormData.mockReturnValue({
    formData,
    formSubmit
  })

  return render(
    <AppLike>
      <FormDataProvider>
        <ContactWrapper currentStep={mockCurrentStep} onClose={onClose} />
      </FormDataProvider>
    </AppLike>
  )
}

describe('ContactWrapper', () => {
  it('should submit when save button is clicked, if the file is from Cozy Drive', () => {
    const mockFormSubmit = jest.fn()
    const userDeviceFile = new File([{}], 'userDeviceFile')
    const { getByTestId } = setup({
      formData: mockFormData({ data: [{ file: userDeviceFile }] }),
      formSubmit: mockFormSubmit
    })

    const btn = getByTestId('ButtonSave')
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

  it('should not diplay ConfirmReplaceFile modal when save button is clicked, if the file is from User Device', () => {
    const userDeviceFile = new File([{}], 'userDeviceFile')
    const { getByTestId, queryByTestId } = setup({
      formData: mockFormData({ data: [{ file: userDeviceFile }] })
    })

    const btn = getByTestId('ButtonSave')
    fireEvent.click(btn)

    expect(queryByTestId('ConfirmReplaceFile')).toBeNull()
  })

  it('should diplay ConfirmReplaceFile modal when save button is clicked, if the file is from Cozy Drive', () => {
    const cozyFile = new Blob()
    const { getByTestId } = setup({
      formData: mockFormData({ data: [{ file: cozyFile }] })
    })

    const btn = getByTestId('ButtonSave')
    fireEvent.click(btn)

    expect(getByTestId('ConfirmReplaceFile'))
  })
})
