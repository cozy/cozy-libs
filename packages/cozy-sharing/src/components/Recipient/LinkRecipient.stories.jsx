import LinkRecipient from './LinkRecipient'

const meta = {
  component: LinkRecipient,
  args: {
    recipientConfirmationData: false,
    verifyRecipient: () => true,
    link: 'test',
    fadeIn: false
  }
}

export default meta

export const Default = {
  name: 'Default'
}
