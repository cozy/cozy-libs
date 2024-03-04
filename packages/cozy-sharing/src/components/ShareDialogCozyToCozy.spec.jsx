import { act, render, fireEvent } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { CozyPassFingerprintDialogContent } from './CozyPassFingerprintDialogContent'
import ShareDialogCozyToCozy from './ShareDialogCozyToCozy'
import AppLike from '../../test/AppLike'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useQuery: jest.fn().mockReturnValue({ data: { public_name: 'Alice' } }),
  hasQueryBeenLoaded: jest.fn().mockReturnValue(true),
  useClient: () => ({ options: { uri: mockRecipientAlice.instance } })
}))

describe('ShareDialogCozyToCozy', () => {
  const client = createMockClient({})
  client.options = {
    uri: 'foo.mycozy.cloud'
  }

  const setup = props => {
    return render(
      <AppLike client={client}>
        <ShareDialogCozyToCozy {...props} />
      </AppLike>
    )
  }

  it('should show sharing dialog directly when no twoStepsConfirmationMethods are provided', () => {
    let props = {
      ...getMockProps()
    }

    const { getByText } = setup(props)

    expect(getByText('You')).toBeTruthy()
    expect(getByText('owner')).toBeTruthy()
  })

  it('should show loading while calling getRecipientsToBeConfirmed', async () => {
    const { promise, resolve } = deferablePromise()

    let props = {
      ...getMockProps(),
      twoStepsConfirmationMethods: {
        getRecipientsToBeConfirmed: jest.fn(() => promise),
        rejectRecipient: jest.fn()
      }
    }

    const { getByText } = setup(props)

    expect(getByText('Loading in progress')).toBeTruthy()

    await act(async () => {
      resolve([
        {
          name: mockRecipientBob.public_name,
          id: 'SOME_ID',
          email: mockRecipientBob.email
        }
      ])
      await promise
    })

    expect(getByText('Verify')).toBeTruthy()
  })

  it('should ask to confirm 1 contact if 1 contact is waiting for confirmation', async () => {
    const { promise, resolve } = deferablePromise()

    let props = {
      ...getMockProps(),
      twoStepsConfirmationMethods: {
        getRecipientsToBeConfirmed: jest.fn(() => promise),
        rejectRecipient: jest.fn()
      }
    }

    const { getByText, getAllByText } = setup(props)

    await act(async () => {
      resolve([
        {
          name: mockRecipientBob.public_name,
          id: 'SOME_ID',
          email: mockRecipientBob.email
        }
      ])
      await promise
    })

    expect(getAllByText('Verify')).toHaveLength(1)
    expect(
      getByText(/Some contacts are waiting for your confirmation/i)
    ).toBeTruthy()
  })

  it('should ask to confirm 2 contacts if 2 contacts are waiting for confirmation', async () => {
    const { promise, resolve } = deferablePromise()

    let props = {
      ...getMockProps(),
      twoStepsConfirmationMethods: {
        getRecipientsToBeConfirmed: jest.fn(() => promise),
        rejectRecipient: jest.fn()
      }
    }

    const { getByText, getAllByText } = setup(props)

    await act(async () => {
      resolve([
        {
          name: mockRecipientBob.public_name,
          id: 'SOME_ID',
          email: mockRecipientBob.email
        },
        {
          name: mockRecipientClaude.public_name,
          id: 'SOME_OTHER_ID',
          email: mockRecipientClaude.email
        }
      ])
      await promise
    })

    expect(getAllByText('Verify')).toHaveLength(2)
    expect(
      getByText(/2 contacts are waiting for your confirmation/i)
    ).toBeTruthy()
  })

  it('should not ask to confirm contacts if no contacts are waiting for confirmation', async () => {
    const { promise, resolve } = deferablePromise()

    let props = {
      ...getMockProps(),
      twoStepsConfirmationMethods: {
        getRecipientsToBeConfirmed: jest.fn(() => promise),
        rejectRecipient: jest.fn()
      }
    }

    const { queryByText } = setup(props)

    await act(async () => {
      resolve([])
      await promise
    })

    expect(queryByText('Verify')).not.toBeInTheDocument()
    expect(
      queryByText(/waiting for your confirmation/i)
    ).not.toBeInTheDocument()
  })

  it(`should display confirmation of 'contact rejection' when user click on the 'reject' button`, async () => {
    const { promise, resolve } = deferablePromise()

    const rejectRecipient = jest.fn(() => Promise.resolve())

    let props = {
      ...getMockProps(),
      twoStepsConfirmationMethods: {
        getRecipientsToBeConfirmed: jest.fn(() => promise),
        rejectRecipient,
        recipientConfirmationDialogContent: CozyPassFingerprintDialogContent
      }
    }

    const { getByText } = setup(props)

    await act(async () => {
      resolve([
        {
          name: mockRecipientBob.public_name,
          id: 'SOME_ID',
          email: mockRecipientBob.email,
          fingerprintPhrase: 'SOME_FINGERPRINT_PHRASE'
        }
      ])
      await promise
    })

    const verifyButton = getByText('Verify')

    await act(async () => fireEvent.click(verifyButton))

    const rejectButton = getByText('Reject')

    await act(async () => fireEvent.click(rejectButton))

    expect(
      getByText(
        `Do you really want to reject contact ${mockRecipientBob.public_name} (${mockRecipientBob.email})?`
      )
    ).toBeTruthy()

    const confirmRejectButton = getByText('Reject')
    await act(async () => fireEvent.click(confirmRejectButton))

    expect(rejectRecipient).toBeCalled()
  })
})

const mockRecipientAlice = {
  status: 'owner',
  public_name: 'Alice',
  email: 'me@alice.cozy.localhost',
  instance: 'http://alice.cozy.localhost:8080',
  type: 'two-way',
  sharingId: 'SOME_SHARING_ID',
  index: 0,
  avatarPath: '/sharings/SOME_SHARING_ID/recipients/0/avatar'
}

const mockRecipientBob = {
  status: 'ready',
  public_name: 'Claude',
  email: 'me@claude.cozy.localhost',
  instance: 'http://claude.cozy.localhost:8080',
  type: 'two-way',
  sharingId: 'SOME_SHARING_ID',
  index: 1,
  avatarPath: '/sharings/SOME_SHARING_ID/recipients/1/avatar'
}

const mockRecipientClaude = {
  status: 'ready',
  public_name: 'Bob',
  email: 'me@bob.cozy.localhost',
  instance: 'http://bob.cozy.localhost:8080',
  type: 'two-way',
  sharingId: 'SOME_SHARING_ID',
  index: 2,
  avatarPath: '/sharings/SOME_SHARING_ID/recipients/2/avatar'
}

const deferablePromise = () => {
  let resolvePointer = undefined
  let rejectPointer = undefined

  let promise = new Promise((resolve, reject) => {
    resolvePointer = resolve
    rejectPointer = reject
  })

  return {
    promise,
    resolve: resolvePointer,
    reject: rejectPointer
  }
}

const getMockProps = () => {
  return {
    contacts: {
      id: 'contacts',
      definition: {
        doctype: 'io.cozy.contacts',
        selector: {
          _id: {
            $gt: null
          }
        },
        indexedFields: ['_id'],
        partialFilter: {
          trashed: {
            $or: [
              {
                $eq: false
              },
              {
                $exists: false
              }
            ]
          },
          $or: [
            {
              cozy: {
                $not: {
                  $size: 0
                }
              }
            },
            {
              email: {
                $not: {
                  $size: 0
                }
              }
            }
          ]
        },
        limit: 1000
      },
      fetchStatus: 'pending',
      lastFetch: null,
      lastUpdate: null,
      lastErrorUpdate: null,
      lastError: null,
      hasMore: false,
      count: 0,
      data: [],
      bookmark: null,
      options: null
    },
    document: {
      id: 'SOME_DOCUMENT_ID',
      name: 'SOME_DOCUMENT_NAME',
      _type: 'com.bitwarden.organizations',
      _id: 'SOME_DOCUMENT_ID'
    },
    documentType: 'Organizations',
    contactGroups: {
      id: 'groups',
      definition: {
        doctype: 'io.cozy.contacts.groups'
      },
      fetchStatus: 'pending',
      lastFetch: null,
      lastUpdate: null,
      lastErrorUpdate: null,
      lastError: null,
      hasMore: false,
      count: 0,
      data: [],
      bookmark: null,
      options: null
    },
    hasSharedParent: null,
    isOwner: true,
    link: null,
    permissions: [],
    recipients: [
      mockRecipientAlice,
      mockRecipientBob,
      mockRecipientClaude,
      {
        status: 'pending',
        email: 'me@ben.cozy.localhost',
        type: 'two-way',
        sharingId: 'SOME_SHARING_ID',
        index: 3,
        avatarPath: '/sharings/SOME_SHARING_ID/recipients/3/avatar'
      }
    ],
    sharing: {
      id: 'SOME_SHARING_ID',
      _id: 'SOME_SHARING_ID',
      _type: 'io.cozy.sharings',
      type: 'io.cozy.sharings',
      attributes: {
        triggers: {
          track_id: 'SOME_TRACK_ID',
          replicate_id: 'SOME_REPLICATE_ID'
        },
        active: true,
        owner: true,
        open_sharing: true,
        description: 'SOME_DOCUMENT_NAME',
        app_slug: 'password',
        created_at: '2021-08-13T16:51:28.562668+02:00',
        updated_at: '2021-08-13T16:51:28.562668+02:00',
        rules: [
          {
            title: 'SOME_DOCUMENT_NAME',
            doctype: 'com.bitwarden.organizations',
            values: ['SOME_DOCUMENT_ID'],
            add: 'sync',
            update: 'sync',
            remove: 'sync'
          },
          {
            title: 'Ciphers',
            doctype: 'com.bitwarden.ciphers',
            selector: 'organization_id',
            values: ['SOME_DOCUMENT_ID'],
            add: 'sync',
            update: 'sync',
            remove: 'sync'
          }
        ],
        members: [
          {
            status: 'owner',
            public_name: 'Alice',
            email: 'me@alice.cozy.localhost',
            instance: 'http://alice.cozy.localhost:8080'
          },
          {
            status: 'ready',
            public_name: 'Claude',
            email: 'me@claude.cozy.localhost',
            instance: 'http://claude.cozy.localhost:8080'
          },
          {
            status: 'ready',
            public_name: 'Bob',
            email: 'me@bob.cozy.localhost',
            instance: 'http://bob.cozy.localhost:8080'
          },
          {
            status: 'pending',
            email: 'me@ben.cozy.localhost'
          }
        ]
      },
      meta: {
        rev: '12-136ad05bd33a80b6a1829a9ec3d918f0'
      },
      links: {
        self: '/sharings/SOME_SHARING_ID'
      },
      relationships: {
        shared_docs: {
          data: [
            {
              id: 'SOME_DOCUMENT_ID',
              type: 'com.bitwarden.organizations'
            }
          ]
        }
      }
    },
    sharingDesc: 'SOME_DOCUMENT_NAME',
    showShareByEmail: true,
    showShareByLink: false,
    showShareOnlyByLink: null,
    showWhoHasAccess: true,
    onRevoke: jest.fn(),
    onShare: jest.fn(),
    createContact: jest.fn()
  }
}
