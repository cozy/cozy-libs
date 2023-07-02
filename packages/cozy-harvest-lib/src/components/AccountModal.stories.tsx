import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'

import { AccountModal } from './AccountModal'
import ConfigurationTab from './KonnectorConfiguration/ConfigurationTab'
import { storybookClient } from '../../.storybook/StoryContainer'
import { AccountModalFixtures } from '../../.storybook/fixtures/AccountModal.fixtures'

const meta: Meta<typeof AccountModal> = {
  argTypes: {
    onDismiss: { action: 'onDismiss' },
    replaceHistory: { action: 'replaceHistory' }
  },
  decorators: [withRouter],
  args: {
    client: storybookClient,
    accountId: '1337',
    t: (key: string) => key,
    showAccountSelection: true,
    showNewAccountButton: true,
    accounts: [],
    initialActiveTab: 'configuration',
    Component: ConfigurationTab,
    location: {
      hash: '',
      key: '5j2q3d',
      pathname: '/connected/stub',
      search: '',
      state: null
    },
    accountsAndTriggers: AccountModalFixtures.accountsAndTriggers,
    konnector: AccountModalFixtures.konnector,
    breakpoints: {
      isMobile: false,
      isTablet: false,
      isDesktop: true
    }
  },
  component: AccountModal,
  parameters: {
    reactRouter: {
      routePath: '/connected/stub/accounts/1337/config'
    }
  }
}

export default meta

type Story = StoryObj<typeof AccountModal>

export const WithConfigurationTab: Story = {
  args: {
    Component: ConfigurationTab
  }
}
