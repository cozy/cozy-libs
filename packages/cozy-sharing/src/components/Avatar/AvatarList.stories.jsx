import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'

import { AvatarList } from './AvatarList'
import { recipients } from '../../../.storybook/fixtures/recipients'

const meta = {
  component: AvatarList,
  args: {
    recipients: [...recipients]
  }
}

export default meta

const AvatarListWithButton = args => {
  return (
    <div className="u-flex">
      <AvatarList {...args} />
      <Button label="Add" />
    </div>
  )
}

export const Default = {
  name: 'Default',
  render: AvatarListWithButton,
  args: {}
}

export const WithGroups = {
  name: 'With groups',
  render: AvatarListWithButton,
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

export const WithLink = {
  name: 'With link',
  render: AvatarListWithButton,
  args: {
    link: {}
  }
}
