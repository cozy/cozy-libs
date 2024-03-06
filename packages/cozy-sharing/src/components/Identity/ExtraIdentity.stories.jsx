import { ExtraIdentity } from './ExtraIdentity'
import { recipients } from '../../../.storybook/fixtures/recipients'

const meta = {
  component: ExtraIdentity,
  args: {
    extraRecipients: recipients
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}
