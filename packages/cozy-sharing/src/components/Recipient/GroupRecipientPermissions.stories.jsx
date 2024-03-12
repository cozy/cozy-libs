import { GroupRecipientPermissions } from './GroupRecipientPermissions'

const meta = {
  component: GroupRecipientPermissions,
  args: {
    onRevoke: () => {},
    onRevokeSelf: () => {},
    type: 'two-way',
    status: 'ready',
    groupIndex: 0
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['ready', 'mail-not-sent', 'pending', 'seen', 'owner'],
      defaultValue: 'ready'
    },
    type: {
      control: 'select',
      options: ['one-way', 'two-way'],
      defaultValue: 'two-way'
    }
  }
}

export default meta

export const Owner = {
  name: 'Owner',
  args: {
    isOwner: true
  }
}

export const Self = {
  name: 'Self',
  args: {
    isOwner: false,
    instance: 'http://alice.cozy.localhost:8080'
  }
}
