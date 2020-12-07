/* eslint no-console: off */

import { render, fireEvent, act } from '@testing-library/react'
import ConfigurationTab from './index'
import React from 'react'
import I18n from 'cozy-ui/transpiled/react/I18n'
import enLocale from '../../../locales/en.json'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { MountPointProvider } from '../../../components/MountPointContext'
import { CozyProvider as CozyClientProvider } from 'cozy-client'
import { createMockClient } from 'cozy-client/dist/mock'
import { deleteAccount } from '../../../connections/accounts'

jest.mock('../../../connections/accounts', () => ({
  deleteAccount: jest.fn()
}))

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
        <CozyClientProvider client={mockClient}>
          <BreakpointsProvider>
            <I18n lang="en" dictRequire={() => enLocale}>
              <ConfigurationTab
                konnector={konnector}
                account={account}
                addAccount={addAccount}
                onAccountDeleted={onAccountDeleted}
                flow={flow}
              />
            </I18n>
          </BreakpointsProvider>
        </CozyClientProvider>
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

  it('should display deletion modal when clicking on disconnect this account', async () => {
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

  it('should not render identifiers for oauth konnectors', () => {
    const { root } = setup({ konnector: { oauth: true } })
    expect(root.queryByText('Identifiers')).toBe(null)
  })
})
