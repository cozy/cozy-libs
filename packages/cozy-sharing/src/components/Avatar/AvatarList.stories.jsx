import { AvatarList } from './AvatarList'
import { recipients } from '../../../.storybook/fixtures/recipients'

const meta = {
  component: AvatarList,
  args: {
    recipients: [...recipients]
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}

export const WithGroups = {
  name: 'With groups',
  args: {
    recipients: [
      ...recipients,
      {
        name: 'Group 1',
        type: 'group',
        members: [
          {
            public_name: 'Alice'
          }
        ]
      }
    ]
  }
}
