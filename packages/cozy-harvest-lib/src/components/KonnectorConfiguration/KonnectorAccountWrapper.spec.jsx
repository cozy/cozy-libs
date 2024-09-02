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
                showNewAccountButton={true}
              />
            </VaultUnlockProvider>
          </VaultProvider>
        </MountPointProvider>
      </AppLike>
    )
    return { root, onAccountDeleted, addAccount }
  }

  it('should render a configuration modal when allow account disconnect', async () => {
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

  it('should render a configuration modal when allow account creation', async () => {
    const { root, addAccount } = setup()
    const button = root.getByText('Add an account')
    fireEvent.click(button)
    expect(addAccount).toHaveBeenCalled()
  })
})
