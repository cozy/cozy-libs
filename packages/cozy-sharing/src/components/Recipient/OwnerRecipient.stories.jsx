import OwnerRecipient from './OwnerRecipient'
import { recipients } from '../../../.storybook/fixtures/recipients'

const meta = {
  component: OwnerRecipient,
  args: {
    recipients
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}
