import { render } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import {
  AvatarList,
  MAX_DISPLAYED_RECIPIENTS,
  excludeMeAsOwnerFromRecipients
} from './AvatarList'
import AppLike from '../../../test/AppLike'

const mockRecipients = new Array(MAX_DISPLAYED_RECIPIENTS - 1)
  .fill(
    {
      status: 'owner',
      public_name: 'cozy',
      index: 'sharing-123-member-0'
    },
    0,
    1
  )
  .fill(
    {
      status: 'pending',
      name: 'Mitch Young',
      index: 'sharing-123-member-1'
    },
    1
  )

const mockMoreRecipientsThanMaxDisplayed = [
  ...mockRecipients,
  {
    status: 'mail-not-send',
    name: 'Lyn Webster',
    index: 'sharing-123-member-2'
  },
  {
    status: 'ready',
    name: 'Richelle Young',
    index: 'sharing-123-member-3'
  },
  {
    status: 'ready',
    name: 'John Connor',
    index: 'sharing-123-member-4'
  }
]

describe('AvatarList', () => {
  const client = createMockClient({})

  const setup = ({
    recipients = mockRecipients,
    link = false,
    isOwner = true,
    onClick = () => jest.fn(),
    ...rest
  }) => {
    return render(
      <AppLike client={client}>
        <AvatarList
          recipients={recipients}
          onClick={onClick}
          isOwner={isOwner}
          link={link}
          {...rest}
        />
      </AppLike>
    )
  }

  it('should render link icon if a link is generated', () => {
    const { getByTestId } = setup({
      link: true
    })

    expect(getByTestId('AvatarList-link')).toBeTruthy()
  })

  it('should not render link icon if a link is not generated', () => {
    const { queryByTestId } = setup({})

    expect(queryByTestId('AvatarList-link')).toBeNull()
  })

  it('should hide me as owner by default', () => {
    const { queryByTestId } = setup({})

    expect(queryByTestId('AvatarList-avatar-owner')).toBeNull()
  })

  it('should show me as owner if required', () => {
    const { getByTestId } = setup({
      showMeAsOwner: true
    })

    expect(getByTestId('AvatarList-avatar-owner')).toBeTruthy()
  })

  it('should show a +X icon with the correct number if there is more avatars than expected', () => {
    const { getByTestId, getByText } = setup({
      recipients: mockMoreRecipientsThanMaxDisplayed,
      showMeAsOwner: true
    })

    const delta =
      mockMoreRecipientsThanMaxDisplayed.length - MAX_DISPLAYED_RECIPIENTS

    expect(getByTestId('AvatarList-plusX')).toBeTruthy()
    expect(getByText(`+${delta}`)).toBeTruthy()
  })

  it('should show both +X and link icon if necessary', () => {
    const { getByTestId } = setup({
      recipients: mockMoreRecipientsThanMaxDisplayed,
      showMeAsOwner: true,
      link: true
    })

    expect(getByTestId('AvatarList-plusX')).toBeTruthy()
    expect(getByTestId('AvatarList-link')).toBeTruthy()
  })
})

describe('excludeMeAsOwnerFromRecipients', () => {
  it('excludeMeAsOwnerFromRecipients behavior', () => {
    const recipients = [
      {
        status: 'owner',
        instance: 'http://foo1.cozy.bar'
      },
      { status: 'pending', instance: 'http://foo2.cozy.bar' },
      {
        status: 'pending',
        instance: 'http://foo3.cozy.bar'
      }
    ]
    const client = { options: { uri: 'http://foo2.cozy.bar' } }
    expect(
      excludeMeAsOwnerFromRecipients({ recipients, isOwner: true, client })
    ).toEqual([
      { status: 'pending', instance: 'http://foo2.cozy.bar' },
      {
        status: 'pending',
        instance: 'http://foo3.cozy.bar'
      }
    ])
    expect(
      excludeMeAsOwnerFromRecipients({ recipients, isOwner: false, client })
    ).toEqual([
      {
        status: 'owner',
        instance: 'http://foo1.cozy.bar'
      },
      {
        status: 'pending',
        instance: 'http://foo3.cozy.bar'
      }
    ])
  })
})
