import { AvatarList } from './AvatarList'
import { recipients } from '../../../.storybook/fixtures/recipients'

const meta = {
  component: AvatarList,
  args: {
    recipients: [...recipients, ...recipients]
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}
