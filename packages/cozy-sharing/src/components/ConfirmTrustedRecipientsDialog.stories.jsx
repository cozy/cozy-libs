import ConfirmTrustedRecipientsDialog from './ConfirmTrustedRecipientsDialog'

const meta = {
  component: ConfirmTrustedRecipientsDialog,
  args: {
    recipientsToBeConfirmed: [
      {
        instance: 'https://example.com',
        isOwner: false,
        status: 'ready',
        recipientConfirmationData: null,
        verifyRecipient: () => {},
        fadeIn: true,
        type: 'two-way',
        onRevoke: () => {},
        onRevokeSelf: () => {}
      }
    ]
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {
    twoStepsConfirmationMethods: {
      getRecipientsToBeConfirmed: () => [
        {
          name: 'John Doe',
          instance: 'https://example.com',
          isOwner: false,
          status: 'ready'
        },
        {
          name: 'Alice Doe',
          instance: 'https://example.com',
          isOwner: false,
          status: 'ready'
        }
      ]
    },
    verifyRecipient: () => {}
  }
}
