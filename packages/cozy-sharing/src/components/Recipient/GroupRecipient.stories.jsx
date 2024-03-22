import { GroupRecipient } from './GroupRecipient'

const meta = {
  component: GroupRecipient,
  args: {
    name: 'Family',
    owner: {
      public_name: 'Alice'
    },
    members: [
      { status: 'ready' },
      { status: 'mail-not-sent' },
      { status: 'pending' },
      { status: 'revoked' }
    ],
    groupIndex: 0
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}

export const InstanceInsideMembers = {
  name: 'Instance inside members',
  args: {
    isOwner: false,
    instance: 'http://alice.cozy.localhost:8080',
    members: [
      { status: 'ready', instance: 'http://alice.cozy.localhost:8080' },
      { status: 'mail-not-sent' },
      { status: 'pending' },
      { status: 'revoked' }
    ]
  }
}
