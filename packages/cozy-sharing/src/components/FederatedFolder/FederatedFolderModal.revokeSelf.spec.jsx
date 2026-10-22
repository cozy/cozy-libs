import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React, { useState } from 'react'

import { createMockClient } from 'cozy-client'

import { FederatedFolderModal } from './FederatedFolderModal'
import AppLike from '../../../test/AppLike'
import { SharingProvider } from '../../SharingProvider'
import { useSharingContext } from '../../hooks/useSharingContext'

jest.mock('../ShareByEmail', () => () => null)
jest.mock('../ShareByLink', () => () => null)

const document = {
  id: 'received-folder',
  _id: 'received-folder',
  name: 'Received drive',
  type: 'directory',
  driveId: 'received-sharing'
}
const instance = 'https://me.mycozy.cloud'
const members = [
  {
    status: 'owner',
    instance: 'https://owner.mycozy.cloud',
    name: 'Owner',
    email: 'owner@test.com'
  },
  {
    status: 'ready',
    instance,
    name: 'Me',
    email: 'me@test.com'
  }
]
const sharing = {
  id: document.driveId,
  _id: document.driveId,
  type: 'io.cozy.sharings',
  attributes: {
    owner: false,
    drive: true,
    active: true,
    rules: [{ values: [document.id] }],
    members
  }
}

function RevocationView() {
  const [hasLeft, setHasLeft] = useState(false)
  const { allLoaded, getSharingForSelf } = useSharingContext()
  if (!allLoaded) return null

  return (
    <>
      <output>
        {getSharingForSelf(document.id) ? 'Member of drive' : 'Not a member'}
      </output>
      {hasLeft ? (
        <h1>Shared drives</h1>
      ) : (
        <FederatedFolderModal
          document={document}
          onClose={() => setHasLeft(true)}
          onRevokeSuccess={() => setHasLeft(true)}
        />
      )}
    </>
  )
}

describe('FederatedFolderModal self-revocation with SharingProvider', () => {
  it('closes and runs the success transition after leaving, without refreshing forbidden members', async () => {
    let hasRevoked = false
    const client = createMockClient({})
    client.options.uri = instance
    client.getStackClient().uri = instance
    client.isLogged = true
    client.plugins.realtime = { subscribe: jest.fn(), unsubscribe: jest.fn() }
    const sharingCol = {
      findByDoctype: async () => ({ data: [sharing] }),
      revokeSelf: async () => {
        hasRevoked = true
      },
      fetchEffectiveRecipients: async () => {
        if (hasRevoked) {
          throw Object.assign(new Error('Forbidden'), { status: 403 })
        }
        return {
          data: members.map((member, memberIndex) => ({
            ...member,
            sources: [
              {
                kind: 'self',
                sharing_id: sharing.id,
                member_index: memberIndex
              }
            ]
          }))
        }
      }
    }
    client.collection = doctype => {
      if (doctype === 'io.cozy.sharings') return sharingCol
      if (doctype === 'io.cozy.permissions') {
        return {
          findLinksByDoctype: async () => ({ data: [] }),
          findLinksByIds: async () => ({ data: [] })
        }
      }
      return { all: async () => ({ data: [] }) }
    }

    render(
      <AppLike client={client}>
        <SharingProvider client={client} doctype="io.cozy.files">
          <RevocationView />
        </SharingProvider>
      </AppLike>
    )

    fireEvent.click(await screen.findByLabelText('Remove from sharing'))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBe(null)
      expect(
        screen.queryByRole('heading', { name: 'Shared drives' })
      ).toBeInTheDocument()
      expect(screen.queryByText('Not a member')).toBeInTheDocument()
    })
    expect(hasRevoked).toBe(true)
  })
})
