import MemberRecipient from './MemberRecipient'

const meta = {
  component: MemberRecipient,
  args: {
    instance: 'https://example.com',
    isOwner: false,
    status: 'ready',
    recipientConfirmationData: null,
    verifyRecipient: () => {},
    fadeIn: true
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

export const RecipientConfirm = {
  name: 'RecipientConfirm',
  args: {
    recipientConfirmationData: {
      email: 'test'
    }
  }
}
