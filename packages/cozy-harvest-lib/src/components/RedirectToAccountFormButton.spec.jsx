import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { MountPointContext } from './MountPointContext'
import RedirectToAccountFormButton from './RedirectToAccountFormButton'
import AppLike from '../../test/AppLike'

describe('redirect to account form button', () => {
  it('should use replaceHistory to navigate', () => {
    const replaceHistory = jest.fn()
    const mountPointContextValue = {
      replaceHistory
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
    expect(replaceHistory).toHaveBeenCalledWith(
      '/accounts/account-id-1337/edit?reconnect'
    )
  })
})
