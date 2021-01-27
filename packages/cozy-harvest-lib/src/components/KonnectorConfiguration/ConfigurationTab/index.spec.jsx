/* eslint no-console: off */

import { render, fireEvent, act } from '@testing-library/react'
import ConfigurationTab from './index'
import React from 'react'
import { MountPointProvider } from '../../../components/MountPointContext'
import { createMockClient } from 'cozy-client/dist/mock'
import { deleteAccount } from '../../../connections/accounts'
import AppLike from '../../../../test/AppLike'
import {
  VaultProvider,
  VaultUnlockPlaceholder,
  VaultUnlockProvider,
  useVaultClient
} from 'cozy-keys-lib'
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

const SimpleVaultUnlocker = ({ onUnlock }) => {
  return <button onClick={onUnlock}>Unlock</button>
}

jest.mock('cozy-keys-lib', () => {
  const actual = jest.requireActual('cozy-keys-lib')
  return {
    ...actual,
    useVaultClient: jest.fn()
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

  function setup({ konnector = {}, checkShouldUnlock } = {}) {
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
    const unlockFormProps = {
      checkShouldUnlock,
      UnlockForm: SimpleVaultUnlocker
    }
    const root = render(
      <MountPointProvider baseRoute="/">
        <AppLike client={mockClient}>
          <VaultProvider instance="http://cozy.tools:8080">
            <VaultUnlockProvider checkShouldUnlock={checkShouldUnlock}>
              <ConfigurationTab
                konnector={konnector}
                account={account}
                addAccount={addAccount}
                onAccountDeleted={onAccountDeleted}
                flow={flow}
              />
              <VaultUnlockPlaceholder unlockFormProps={unlockFormProps} />
            </VaultUnlockProvider>
          </VaultProvider>
        </AppLike>
      </MountPointProvider>
    )
    return { root }
  }

  beforeEach(() => {
    deleteAccount.mockReset()
  })

  it('should render', () => {
    const { root } = setup()
    expect(root.getByText('Identifiers')).toBeTruthy()
  })

  describe('deletion modal', () => {
    it('should display deletion modal when clicking on disconnect this account (vault does not need to be unlocked)', async () => {
      const { root } = setup({
        checkShouldUnlock: jest.fn().mockResolvedValue(false)
      })
      useVaultClient.mockReturnValue({
        isLocked: jest.fn().mockResolvedValue(false)
      })
      findKonnectorPolicy.mockReturnValue({ saveInVault: true })
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

    it('should display deletion modal when clicking on disconnect this account (vault needs to be unlocked, connector policy does not save in vault)', async () => {
      findKonnectorPolicy.mockReturnValue({ saveInVault: false })
      const { root } = setup({
        checkShouldUnlock: jest.fn().mockResolvedValue(true)
      })
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

    it('should display deletion modal when clicking on disconnect this account (vault needs to be unlocked, connector policy saves in vault)', async () => {
      findKonnectorPolicy.mockReturnValue({ saveInVault: true })
      useVaultClient.mockReturnValue({
        isLocked: jest.fn().mockResolvedValue(true)
      })
      const { root } = setup({
        checkShouldUnlock: jest.fn().mockResolvedValue(true)
      })
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
  })

  it('should not render identifiers for oauth konnectors', () => {
    useVaultClient.mockReturnValue({
      isLocked: jest.fn().mockResolvedValue(false)
    })
    const { root } = setup({ konnector: { oauth: true } })
    expect(root.queryByText('Identifiers')).toBe(null)
  })
})
