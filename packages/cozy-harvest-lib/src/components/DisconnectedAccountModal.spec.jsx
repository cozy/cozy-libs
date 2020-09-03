import React from 'react'
import { render } from '@testing-library/react'

import { CozyProvider } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import I18n from 'cozy-ui/transpiled/react/I18n'

import DisconnectedAccountModal from './DisconnectedAccountModal'
import bankAccounts from './KonnectorConfiguration/ConfigurationTab/bank-account-fixture.json'
import en from '../locales/en.json'

describe('DisconnectedAccountModal', () => {
  const setup = () => {
    const mockClient = {}
    const root = render(
      <CozyProvider client={mockClient}>
        <I18n lang="en" dictRequire={() => en}>
          <BreakpointsProvider>
            <DisconnectedAccountModal accounts={[bankAccounts]} />
          </BreakpointsProvider>
        </I18n>
      </CozyProvider>
    )
    return { root }
  }

  it('should render a modal without warnings', () => {
    const { root } = setup()
    expect(() => root.getByText('Mon Compte Societaire')).not.toThrow()
  })
})
