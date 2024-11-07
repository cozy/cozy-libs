import { render } from '@testing-library/react'
import React from 'react'

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

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('NewAccountModal', () => {
  const clientTrigger = {
    worker: 'client',
    message: {
      account: 'accountNumberClient'
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    render(
      <AppLike client={{}}>
        <NewAccountModal
          konnector={{ slug: 'konnectorslug', name: 'konnector slug' }}
        />
      </AppLike>
    )
  }

  it('should redirect to route without success on login success for client triggers', () => {
    setup()

    onLoginSuccessFn(clientTrigger)

    expect(mockNavigate).toHaveBeenCalledWith(
      '../accounts/accountNumberClient',
      {
        relative: 'path',
        replace: true
      }
    )
  })

  it('should redirect to route without success on success for client triggers', () => {
    setup()

    onSuccessFn(clientTrigger)

    expect(mockNavigate).toHaveBeenCalledWith(
      '../accounts/accountNumberClient',
      {
        relative: 'path',
        replace: true
      }
    )
  })
})
