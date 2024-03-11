import MemberRecipient from './MemberRecipient'

const meta = {
  component: MemberRecipient,
  args: {
    instance: 'https://example.com',
    isOwner: false,
    status: 'ready',
    recipientConfirmationData: null,
    verifyRecipient: () => {},
    fadeIn: true,
    type: 'two-way',
    onRevoke: () => {},
    onRevokeSelf: () => {}
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['ready', 'mail-not-sent', 'pending', 'seen', 'owner'],
      defaultValue: 'ready'
    }
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}

export const Owner = {
  name: 'Owner',
  args: {
    isOwner: true,
    status: 'owner'
  }
}

export const SameInstance = {
  name: 'SameInstance',
  args: {
    isOwner: false,
    instance: 'http://alice.cozy.localhost:8080'
  }
}

export const RecipientConfirm = {
  name: 'RecipientConfirm',
  args: {
    recipientConfirmationData: {
      email: 'test'
    }
  }
}
