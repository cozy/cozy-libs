import type { Meta, StoryObj } from '@storybook/react'

import { AccountSelectorHeader } from './AccountSelectorHeader'
import { AccountSelectorHeaderFixtures } from '../../../.storybook/fixtures/AccountSelectorHeader.fixtures'

const meta: Meta<typeof AccountSelectorHeader> = {
  component: AccountSelectorHeader,
  argTypes: {
    replaceHistory: { action: 'replaceHistory' },
    pushHistory: { action: 'pushHistory' }
  },
  args: {
    account: AccountSelectorHeaderFixtures.account,
    accountsAndTriggers: AccountSelectorHeaderFixtures.accountsAndTriggers,
    konnector: AccountSelectorHeaderFixtures.konnector
  }
}

export default meta

type Story = StoryObj<typeof AccountSelectorHeader>

export const WithAccountSelection: Story = {
  name: 'With account selection',
  args: {
    showAccountSelection: true
  }
}

export const WithoutAccountSelection: Story = {
  name: 'Without account selection',
  args: {
    showAccountSelection: false
  }
}
