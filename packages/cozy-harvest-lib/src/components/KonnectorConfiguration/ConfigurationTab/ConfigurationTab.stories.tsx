import type { Meta, StoryObj } from '@storybook/react'

import ConfigurationTab from './'
import { ConfigurationTabFixtures } from '../../../../.storybook/fixtures/ConfigurationTab.fixtures'

const meta: Meta<typeof ConfigurationTab> = {
  argTypes: {
    addAccount: { action: 'addAccount' },
    onAccountDeleted: { action: 'onAccountDeleted' }
  },
  component: ConfigurationTab
}

export default meta

type Story = StoryObj<typeof ConfigurationTab>

export const Default: Story = {
  args: {
    account: ConfigurationTabFixtures.account,
    flow: ConfigurationTabFixtures.flow,
    innerAccountModalOverrides: undefined,
    intentsApi: undefined,
    konnector: ConfigurationTabFixtures.konnector,
    showNewAccountButton: true
  }
}
