import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MountPointContext } from './MountPointContext'
import RedirectToAccountFormButton from './RedirectToAccountFormButton'
import AppLike from '../../test/AppLike'

describe('redirect to account form button', () => {
  it('should use pushHistory to navigate', () => {
    const pushHistory = jest.fn()
    const mountPointContextValue = {
      pushHistory
    }
    const trigger = {
      message: {
        account: 'account-id-1337'
      }
    }
    const root = render(
      <AppLike>
        <MountPointContext.Provider value={mountPointContextValue}>
          <RedirectToAccountFormButton trigger={trigger} />
        </MountPointContext.Provider>
      </AppLike>
    )
    fireEvent.click(root.getByText('Reconnect'))
    expect(pushHistory).toHaveBeenCalledWith('/accounts/account-id-1337/edit')
  })
})
