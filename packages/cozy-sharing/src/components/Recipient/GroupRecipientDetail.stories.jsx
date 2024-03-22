import { GroupRecipientDetail } from './GroupRecipientDetail'

const meta = {
  component: GroupRecipientDetail,
  args: {
    name: 'Family',
    owner: {
      public_name: 'Alice'
    }
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {
    members: [
      {
        name: 'Alice',
        instance: 'http://alice.cozy.localhost:8080',
        status: 'ready'
      },
      { name: 'marine@google.com', status: 'mail-not-sent' },
      { email: 'Martin', status: 'pending' },
      { name: 'Paul', status: 'revoked' }
    ]
  }
}

export const OnlyWithAccess = {
  name: 'OnlyWithAccess',
  args: {
    members: [
      {
        name: 'Alice',
        instance: 'http://alice.cozy.localhost:8080',
        status: 'ready'
      },
      { name: 'Martin', status: 'pending' }
    ]
  }
}

export const OnlyWithoutAccess = {
  name: 'OnlyWithoutAccess',
  args: {
    members: [
      { name: 'marine@google.com', status: 'mail-not-sent' },
      { name: 'Paul', status: 'revoked' }
    ]
  }
}
