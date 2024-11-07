import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import RedirectToAccountFormButton from './RedirectToAccountFormButton'
import AppLike from '../../test/AppLike'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('redirect to account form button', () => {
  it('should navigate to reconnect page', () => {
    const trigger = {
      message: {
        account: 'account-id-1337'
      }
    }
    const root = render(
      <AppLike>
        <RedirectToAccountFormButton trigger={trigger} />
      </AppLike>
    )
    fireEvent.click(root.getByText('Reconnect'))
    expect(mockNavigate).toHaveBeenCalledWith(
      '../accounts/account-id-1337/edit?reconnect',
      {
        replace: true
      }
    )
  })
})
