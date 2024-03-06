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
