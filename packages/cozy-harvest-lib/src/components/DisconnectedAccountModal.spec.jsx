import React from 'react'
import { render } from '@testing-library/react'

import AppLike from '../../test/AppLike'
import DisconnectedAccountModal from './DisconnectedAccountModal'
import bankAccounts from './KonnectorConfiguration/ConfigurationTab/bank-account-fixture.json'

describe('DisconnectedAccountModal', () => {
  const setup = () => {
    const mockClient = {}
    const root = render(
      <AppLike client={mockClient}>
        <DisconnectedAccountModal
          accounts={[bankAccounts]}
          onClose={jest.fn()}
        />
      </AppLike>
    )
    return { root }
  }

  it('should render a modal without warnings', () => {
    const { root } = setup()
    expect(() => root.getByText('Mon Compte Societaire')).not.toThrow()
  })
})
