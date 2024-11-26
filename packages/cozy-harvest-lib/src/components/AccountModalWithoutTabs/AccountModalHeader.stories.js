import { reactRouterParameters } from 'storybook-addon-remix-react-router'

import { AccountModalHeader } from './AccountModalHeader'
import { AccountSelectorHeaderFixtures } from '../../../.storybook/fixtures/AccountSelectorHeader.fixtures'

const meta = {
  component: AccountModalHeader,
  args: {
    account: AccountSelectorHeaderFixtures.account,
    accountsAndTriggers: AccountSelectorHeaderFixtures.accountsAndTriggers,
    konnector: AccountSelectorHeaderFixtures.konnector
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {
    showAccountSelection: true
  }
}

export const InsideConfig = {
  name: 'Inside config',
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        path: '/connected/stub/accounts/:accountId/config',
        pathParams: {
          accountId: '1337'
        }
      },
      routing: {
        path: '/connected/stub/accounts/1337/config',
        handle: 'Config'
      }
    })
  }
}
