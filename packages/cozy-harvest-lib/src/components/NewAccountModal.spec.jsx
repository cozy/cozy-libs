/* eslint-env jest */
import { render } from '@testing-library/react'
import React from 'react'

import { MountPointContext } from './MountPointContext'
import NewAccountModal from './NewAccountModal'
import AppLike from '../../test/AppLike'

let onLoginSuccessFn
let onSuccessFn
jest.mock('./TriggerManager', () => ({ onLoginSuccess, onSuccess }) => {
  onLoginSuccessFn = onLoginSuccess
  onSuccessFn = onSuccess
  return null
})
jest.mock('./hooks/useMaintenanceStatus', () => () => ({
  fetchStatus: 'loaded',
  data: { isInMaintenance: false, messages: {} }
}))

describe('NewAccountModal', () => {
  const replaceHistory = jest.fn()
  const mountPointContextValue = {
    replaceHistory
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
    expect(replaceHistory).toHaveBeenCalledWith(
      '/accounts/accountNumber/success'
    )
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
    expect(replaceHistory).toHaveBeenCalledWith('/accounts/accountNumberClient')
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
    expect(replaceHistory).toHaveBeenCalledWith(
      '/accounts/accountNumber/success'
    )
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
    expect(replaceHistory).toHaveBeenCalledWith('/accounts/accountNumberClient')
  })
})
