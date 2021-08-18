/* eslint-env jest */
import React from 'react'

import { render } from '@testing-library/react'
import AppLike from '../../test/AppLike'
import NewAccountModal from './NewAccountModal'
import { MountPointContext } from './MountPointContext'

let onLoginSuccessFn
let onSuccessFn
jest.mock('./TriggerManager', () => ({ onLoginSuccess, onSuccess }) => {
  onLoginSuccessFn = onLoginSuccess
  onSuccessFn = onSuccess
  return null
})
jest.mock('./DialogContext', () => {
  return {
    useDialogContext: () => {
      return {
        dialogTitleProps: {
          className: 'class'
        }
      }
    }
  }
})

describe('NewAccountModal', () => {
  const pushHistory = jest.fn()
  const mountPointContextValue = {
    pushHistory
  }
  const konnectorTrigger = {
    worker: 'konnector',
    message: {
      account: 'accountNumber'
    }
  }

  const clientTrigger = {
    worker: 'client',
    message: {
      account: 'accountNumberClient'
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should redirect to success route on login success for non client triggers', () => {
    render(
      <AppLike client={{}}>
        <MountPointContext.Provider value={mountPointContextValue}>
          <NewAccountModal
            konnector={{ slug: 'konnectorslug', name: 'konnector slug' }}
          />
        </MountPointContext.Provider>
      </AppLike>
    )
    onLoginSuccessFn(konnectorTrigger)
    expect(pushHistory).toHaveBeenCalledWith('/accounts/accountNumber/success')
  })
  it('should redirect to route without success on login success for client triggers', () => {
    render(
      <AppLike client={{}}>
        <MountPointContext.Provider value={mountPointContextValue}>
          <NewAccountModal
            konnector={{ slug: 'konnectorslug', name: 'konnector slug' }}
          />
        </MountPointContext.Provider>
      </AppLike>
    )
    onLoginSuccessFn(clientTrigger)
    expect(pushHistory).toHaveBeenCalledWith('/accounts/accountNumberClient')
  })

  it('should redirect to success route on success for non client triggers', () => {
    render(
      <AppLike client={{}}>
        <MountPointContext.Provider value={mountPointContextValue}>
          <NewAccountModal
            konnector={{ slug: 'konnectorslug', name: 'konnector slug' }}
          />
        </MountPointContext.Provider>
      </AppLike>
    )
    onSuccessFn(konnectorTrigger)
    expect(pushHistory).toHaveBeenCalledWith('/accounts/accountNumber/success')
  })
  it('should redirect to route without success on success for client triggers', () => {
    render(
      <AppLike client={{}}>
        <MountPointContext.Provider value={mountPointContextValue}>
          <NewAccountModal
            konnector={{ slug: 'konnectorslug', name: 'konnector slug' }}
          />
        </MountPointContext.Provider>
      </AppLike>
    )
    onSuccessFn(clientTrigger)
    expect(pushHistory).toHaveBeenCalledWith('/accounts/accountNumberClient')
  })
})
