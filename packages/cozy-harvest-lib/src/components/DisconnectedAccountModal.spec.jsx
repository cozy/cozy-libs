import { render } from '@testing-library/react'
import React from 'react'

import { CozyConfirmDialogProvider } from './CozyConfirmDialogProvider'
import DisconnectedAccountModal from './DisconnectedAccountModal'
import bankAccounts from './KonnectorConfiguration/ConfigurationTab/bank-account-fixture.json'
import AppLike from '../../test/AppLike'

describe('DisconnectedAccountModal', () => {
  const setup = () => {
    const mockClient = {}
    mockClient.plugins = {
      realtime: {
        subscribe: jest.fn(),
        unsubscribe: jest.fn()
      }
    }
    mockClient.dispatch = jest.fn()
    const root = render(
      <AppLike client={mockClient}>
        <CozyConfirmDialogProvider>
          <DisconnectedAccountModal
            accounts={[bankAccounts]}
            onClose={jest.fn()}
          />
        </CozyConfirmDialogProvider>
      </AppLike>
    )
    return { root }
  }

  it('should render a modal without warnings', () => {
    const { root } = setup()
    expect(() => root.getByText('Mon Compte Societaire')).not.toThrow()
  })
})
