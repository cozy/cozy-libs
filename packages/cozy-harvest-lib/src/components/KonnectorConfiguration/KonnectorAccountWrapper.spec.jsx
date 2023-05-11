import { act, fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'

import { VaultProvider } from 'cozy-keys-lib'

import ConfigurationTab from './ConfigurationTab'
import KonnectorAccountWrapper from './KonnectorAccountWrapper'
import AppLike from '../../../test/AppLike'
import { MountPointProvider } from '../MountPointContext'
import VaultUnlockProvider from '../VaultUnlockProvider'

jest.mock('./ConfigurationTab/Contracts.jsx', () => {
  return {
    ContractsForAccount: () => null
  }
})

jest.mock('cozy-keys-lib', () => {
  const actual = jest.requireActual('cozy-keys-lib')
  return {
    ...actual,
    CozyUtils: {
      checkHasInstalledExtension: jest.fn()
    }
  }
})

jest.mock('react-router-dom', () => {
  return {
    useNavigate: () => ({}),
    useLocation: () => ({})
  }
})

jest.mock('cozy-flags', () => {
  return flag => {
    if (flag === 'harvest.inappconnectors.enabled') return true
    return false
  }
})

describe('KonnectorAccountWrapper', () => {
  const setup = () => {
    const mockClient = {
      plugins: {
        realtime: {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
      },
      destroy: jest.fn(),
      collection: () => ({
        get: jest.fn().mockImplementation(() => {
          return { data: { trigger } }
        })
      })
    }
    const trigger = { _id: 'testtriggerid', arguments: '0 0 0 0 0' }
    const konnector = { slug: 'testkonnector' }
    const account = { _id: 'testaccountid' }
    const onAccountDeleted = jest.fn()
    const addAccount = jest.fn()
    const root = render(
      <AppLike client={mockClient}>
        <MountPointProvider baseRoute="/">
          <VaultProvider instance="http://cozy.tools:8080">
            <VaultUnlockProvider>
              <KonnectorAccountWrapper
                account={account}
                addAccount={addAccount}
                onAccountDeleted={onAccountDeleted}
                konnector={konnector}
                initialTrigger={trigger}
                pushHistory={jest.fn()}
                Component={ConfigurationTab}
              />
            </VaultUnlockProvider>
          </VaultProvider>
        </MountPointProvider>
      </AppLike>
    )
    return { root, onAccountDeleted }
  }

  it('should render a configuration modal when harvest.inappconnectors.enabled flag is enabled and allow account disconnect', async () => {
    const { root, onAccountDeleted } = setup()
    await act(async () => {
      const button = root.getByText('Disconnect this account')
      fireEvent.click(button)
    })
    await act(async () => {
      const button = root.getByText('Disconnect')
      fireEvent.click(button)
      await waitFor(() => expect(onAccountDeleted).toHaveBeenCalled())
    })
  })
})
