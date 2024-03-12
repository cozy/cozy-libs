import { RecipientList } from './RecipientList'
import { recipients } from '../../../.storybook/fixtures/recipients'

const meta = {
  component: RecipientList,
  args: {
    recipients,
    recipientsToBeConfirmed: [],
    isOwner: false,
    onRevoke: () => {},
    onRevokeSelf: () => {},
    verifyRecipient: () => true
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
    isOwner: true
  }
}

export const WithGroup = {
  name: 'With group',
  args: {
    recipients: [
      ...recipients,
      {
        id: '2c8d4d5abbec5b4606a1ebe01a021dfd',
        name: 'Famille',
        addedBy: 0,
        read_only: false,
        index: 0,
        members: [
          {
            status: 'pending',
            email: 'ben@gmail.com',
            only_in_groups: true,
            groups: [0],
            type: 'two-way',
            index: 1
          },
          {
            status: 'pending',
            email: 'bob@gmail.com',
            only_in_groups: true,
            groups: [0],
            type: 'two-way',
            index: 2
          }
        ]
      }
    ]
  }
}
