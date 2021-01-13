/* eslint no-console: off */

import { render, fireEvent, act } from '@testing-library/react'
import ConfigurationTab from './index'
import React from 'react'
import { MountPointProvider } from '../../../components/MountPointContext'
import { createMockClient } from 'cozy-client/dist/mock'
import { deleteAccount } from '../../../connections/accounts'
import AppLike from '../../../../test/AppLike'
import { CozyUtils } from 'cozy-keys-lib'
import {
  VaultUnlockProvider,
  VaultUnlockPlaceholder
} from '../../vaultUnlockContext'
import { findKonnectorPolicy } from '../../../konnector-policies'

jest.mock('../../../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))

jest.mock('../../../connections/accounts', () => ({
  deleteAccount: jest.fn()
}))

jest.mock('../../../models/cipherUtils', () => ({
  unshareCipher: jest.fn()
}))

jest.mock('cozy-keys-lib', () => {
  const FakeVaultUnlocker = ({ onUnlock }) => {
    return <button onClick={onUnlock}>Unlock</button>
  }
  return {
    useVaultClient: jest.fn(),
    withVaultClient: jest.fn().mockReturnValue({
      displayName: 'withVault'
    }),
    CozyUtils: {
      checkHasInstalledExtension: jest.fn()
    },
    VaultUnlocker: FakeVaultUnlocker
  }
})

describe('ConfigurationTab', () => {
  let originalWarn
  beforeEach(() => {
    originalWarn = console.warn
    console.warn = function(msg) {
      if (msg && msg.includes && msg.includes('componentWillReceiveProps')) {
        return
      }
      return originalWarn.apply(this, arguments)
    }
  })

  afterEach(() => {
    console.warn = originalWarn
  })

  function setup({ konnector = {} } = {}) {
    const account = {}
    const addAccount = jest.fn()
    const onAccountDeleted = jest.fn()
    const flow = {
      getState: jest.fn().mockReturnValue({
        error: null,
        running: true
      })
    }
    const mockClient = createMockClient({ queries: {} })
    const root = render(
      <MountPointProvider baseRoute="/">
        <AppLike client={mockClient}>
          <VaultUnlockProvider>
            <ConfigurationTab
              konnector={konnector}
              account={account}
              addAccount={addAccount}
              onAccountDeleted={onAccountDeleted}
              flow={flow}
            />
            <VaultUnlockPlaceholder />
          </VaultUnlockProvider>
        </AppLike>
      </MountPointProvider>
    )
    return { root }
  }

  it('should render', () => {
    const { root } = setup()
    expect(root.getByText('Identifiers')).toBeTruthy()
  })

  beforeEach(() => {
    deleteAccount.mockReset()
  })

  it('should display deletion modal when clicking on disconnect this account (pass extension not installed)', async () => {
    CozyUtils.checkHasInstalledExtension.mockReturnValue(false)
    const { root } = setup()
    const btn = root.getByText('Disconnect this account')
    const modalText =
      'Your account will be disconnected, but already imported data will be kept.'
    expect(root.queryByText(modalText)).toBeFalsy()
    fireEvent.click(btn)
    expect(root.getByText(modalText))
    expect(deleteAccount).not.toHaveBeenCalled()
    const confirmBtn = root.getByText('Disconnect')
    await act(async () => {
      fireEvent.click(confirmBtn)
    })
    expect(deleteAccount).toHaveBeenCalled()
  })

  it('should display deletion modal when clicking on disconnect this account (pass extension installed, connector policy does not save in vault)', async () => {
    CozyUtils.checkHasInstalledExtension.mockReturnValue(true)
    findKonnectorPolicy.mockReturnValue({ saveInVault: false })
    const { root } = setup()
    const btn = root.getByText('Disconnect this account')
    expect(
      root.queryByText(
        'Your account will be disconnected, but already imported data will be kept.'
      )
    ).toBeFalsy()
    fireEvent.click(btn)
    expect(
      root.getByText(
        'Your account will be disconnected, but already imported data will be kept.'
      )
    )
    expect(deleteAccount).not.toHaveBeenCalled()
    const confirmBtn = root.getByText('Disconnect')
    await act(async () => {
      fireEvent.click(confirmBtn)
    })
    expect(deleteAccount).toHaveBeenCalled()
  })

  it('should display deletion modal when clicking on disconnect this account (pass extension installed, connector policy saves in vault)', async () => {
    CozyUtils.checkHasInstalledExtension.mockReturnValue(true)
    findKonnectorPolicy.mockReturnValue({ saveInVault: true })
    const { root } = setup()
    const btn = root.getByText('Disconnect this account')
    expect(
      root.queryByText(
        'Your account will be disconnected, but already imported data will be kept.'
      )
    ).toBeFalsy()
    fireEvent.click(btn)
    expect(
      root.getByText(
        'Your account will be disconnected, but already imported data will be kept.'
      )
    )
    expect(deleteAccount).not.toHaveBeenCalled()
    const confirmBtn = root.getByText('Disconnect')
    await act(async () => {
      fireEvent.click(confirmBtn)
    })
    expect(deleteAccount).not.toHaveBeenCalled()

    // Since the konnector saves the cipher in the vault, we need to unlock the
    // vault, for the cipher to be correctly unshared from the vault
    await act(async () => {
      fireEvent.click(root.getByText('Unlock'))
    })
    expect(deleteAccount).toHaveBeenCalled()
  })

  it('should not render identifiers for oauth konnectors', () => {
    const { root } = setup({ konnector: { oauth: true } })
    expect(root.queryByText('Identifiers')).toBe(null)
  })
})
