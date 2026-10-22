import { act, render, screen } from '@testing-library/react'
import { endOfDay } from 'date-fns'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { SharingProvider } from './SharingProvider'
import SharingContext from './context'
import reducer, {
  addSharingLink,
  getDocumentPermissions,
  getDocumentSharing,
  getEffectiveRecipients,
  receiveEffectiveRecipients,
  receiveSharings
} from './state'
import AppLike from '../test/AppLike'

const AppWrapper = ({ children, client, isPublic }) => {
  return (
    <AppLike client={client}>
      <SharingProvider client={client} isPublic={isPublic}>
        {children}
      </SharingProvider>
    </AppLike>
  )
}

const setupProvider = (client, options = {}, state = reducer()) => {
  const provider = new SharingProvider({ client, ...options })
  provider.state = {
    ...provider.state,
    ...state,
    onShared: provider.state.onShared
  }
  provider.dispatch = jest.fn(action => {
    const onShared = provider.state.onShared
    provider.state = {
      ...provider.state,
      ...reducer(provider.state, action),
      onShared
    }
  })
  return provider
}

describe('allLoaded', () => {
  const client = createMockClient({})
  client.isLogged = true
  client.collection = () => ({
    findByDoctype: jest.fn().mockResolvedValue({
      data: []
    }),
    findLinksByDoctype: jest.fn().mockResolvedValue({
      data: []
    }),
    findApps: jest.fn().mockResolvedValue({
      data: []
    })
  })

  it('Change to True when all data is loaded', async () => {
    render(
      <AppWrapper client={client}>
        <SharingContext.Consumer>
          {({ allLoaded }) => <div>{`allLoaded: ${allLoaded}`}</div>}
        </SharingContext.Consumer>
      </AppWrapper>
    )

    expect(screen.getByText('allLoaded: false')).toBeInTheDocument()

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(screen.getByText('allLoaded: true')).toBeInTheDocument()
  })
})

describe('SharingProvider', () => {
  const client = createMockClient({})

  client.plugins.realtime = {
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  }

  client.isLogged = true

  beforeEach(() => {
    jest.spyOn(client, 'collection').mockReturnValue({
      findByDoctype: jest.fn().mockResolvedValue({ data: [] }),
      findLinksByDoctype: jest.fn().mockResolvedValue({ data: [] }),
      findApps: jest.fn().mockResolvedValue({ data: [] })
    })
    jest
      .spyOn(SharingProvider.prototype, 'fetchAllSharings')
      .mockReturnValue(Promise.resolve())
  })
  afterEach(() => jest.resetAllMocks())

  it('loads data on mount', () => {
    render(<AppWrapper client={client} />)

    expect(client.plugins.realtime.subscribe).toHaveBeenCalled()
    expect(SharingProvider.prototype.fetchAllSharings).toHaveBeenCalled()
  })

  it('loads nothing when the client is not logged in', () => {
    client.isLogged = false
    render(<AppWrapper client={client} />)

    expect(client.plugins.realtime.subscribe).not.toHaveBeenCalled()
    expect(SharingProvider.prototype.fetchAllSharings).not.toHaveBeenCalled()

    client.emit('plugin:realtime:login')
    expect(client.plugins.realtime.subscribe).toHaveBeenCalled()
    expect(SharingProvider.prototype.fetchAllSharings).toHaveBeenCalled()
  })

  it("should not call collection's methods but always subscribe to the realtime when isPublic is true", () => {
    client.isLogged = true
    render(<AppWrapper client={client} isPublic={true} />)

    expect(SharingProvider.prototype.fetchAllSharings).toHaveBeenCalled()
    expect(client.plugins.realtime.subscribe).toHaveBeenCalled()
    expect(client.collection().findByDoctype).not.toHaveBeenCalled()
    expect(client.collection().findLinksByDoctype).not.toHaveBeenCalled()
    expect(client.collection().findApps).not.toHaveBeenCalled()
  })
})

describe('shareByLink', () => {
  const PERM_DRIVE_FILE = {
    type: 'io.cozy.permissions',
    id: 'perm_drive_file',
    attributes: {
      type: 'share',
      permissions: {
        rule0: {
          type: 'io.cozy.files',
          verbs: ['GET'],
          values: ['file_in_drive']
        }
      },
      shortcodes: { code: 'shortcode123' }
    }
  }

  const driveFile = {
    _id: 'file_in_drive',
    id: 'file_in_drive',
    driveId: 'drive_123'
  }

  it('dispatches addSharingLink exactly once for a shared drive file', async () => {
    const mockCreateSharingLink = jest
      .fn()
      .mockResolvedValue({ data: PERM_DRIVE_FILE })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      createSharingLink: mockCreateSharingLink
    })

    const provider = setupProvider(mockClient)

    await provider.shareByLink(driveFile, { verbs: ['GET'] })

    expect(provider.dispatch).toHaveBeenCalledTimes(1)
    const permissions = getDocumentPermissions(provider.state, driveFile._id)
    expect(permissions).toHaveLength(1)
    expect(permissions[0].id).toBe(PERM_DRIVE_FILE.id)
  })

  it('dispatches addSharingLink once for a regular file (non shared drive)', async () => {
    const PERM_REGULAR_FILE = {
      type: 'io.cozy.permissions',
      id: 'perm_regular_file',
      attributes: {
        type: 'share',
        permissions: {
          rule0: {
            type: 'io.cozy.files',
            verbs: ['GET'],
            values: ['regular_file_id']
          }
        },
        shortcodes: { code: 'shortcode456' }
      }
    }
    const regularFile = { _id: 'regular_file_id', id: 'regular_file_id' }
    const mockCreateSharingLink = jest
      .fn()
      .mockResolvedValue({ data: PERM_REGULAR_FILE })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      createSharingLink: mockCreateSharingLink
    })

    const provider = setupProvider(mockClient)
    provider.permissionCol = { createSharingLink: mockCreateSharingLink }

    await provider.shareByLink(regularFile, { verbs: ['GET'] })

    expect(provider.dispatch).toHaveBeenCalledTimes(1)
    const permissions = getDocumentPermissions(provider.state, regularFile._id)
    expect(permissions).toHaveLength(1)
    expect(permissions[0].id).toBe(PERM_REGULAR_FILE.id)
  })
})

describe('ensureSharingLink', () => {
  const permission = {
    id: 'permission-id',
    attributes: {
      permissions: {
        rule0: {
          verbs: ['GET'],
          values: ['file-id']
        }
      },
      shortcodes: { code: 'share-code' }
    }
  }
  const document = { _id: 'file-id', name: 'invoice.pdf' }
  const linkAccess = {
    editingRights: 'write',
    dateEnabled: false,
    selectedDate: null,
    passwordEnabled: false,
    password: ''
  }

  it('fetches regular links with the regular permission API', async () => {
    const client = createMockClient({})
    client.getStackClient = () => ({ uri: 'https://cozy.example' })
    client.collection = jest.fn().mockReturnValue({})
    client.capabilities = { flat_subdomains: true }
    const provider = setupProvider(client, {
      doctype: 'io.cozy.files',
      documentType: 'Files'
    })
    const unrelatedPermission = {
      ...permission,
      id: 'unrelated-permission-id',
      attributes: {
        ...permission.attributes,
        permissions: {
          rule0: {
            ...permission.attributes.permissions.rule0,
            values: ['other']
          }
        }
      }
    }
    const findLinksByDoctype = jest
      .fn()
      .mockResolvedValue({ data: [permission, unrelatedPermission] })
    const findLinksByIds = jest.fn(() => {
      throw new Error('findLinksByIds is only supported for shared drives')
    })
    provider.permissionCol = { findLinksByDoctype, findLinksByIds }
    provider.updateDocumentPermissions = jest
      .fn()
      .mockResolvedValue([{ data: permission }])

    await provider.ensureSharingLink(document, linkAccess)

    expect(findLinksByDoctype).toHaveBeenCalledWith('io.cozy.files')
    expect(findLinksByIds).not.toHaveBeenCalled()
    expect(provider.updateDocumentPermissions).toHaveBeenCalledWith(
      { ...document, id: 'file-id' },
      expect.any(Object),
      [permission]
    )
  })

  it('updates an existing link and returns its public URL', async () => {
    const client = createMockClient({})
    client.getStackClient = () => ({ uri: 'https://cozy.example' })
    client.collection = jest.fn().mockReturnValue({})
    client.capabilities = { flat_subdomains: true }
    const provider = setupProvider(client, { documentType: 'Files' })
    provider.fetchSharingLinks = jest.fn().mockResolvedValue([permission])
    provider.updateDocumentPermissions = jest
      .fn()
      .mockResolvedValue([{ data: permission }])

    const result = await provider.ensureSharingLink(document, linkAccess)

    expect(provider.updateDocumentPermissions).toHaveBeenCalledWith(
      { ...document, id: 'file-id' },
      {
        verbs: ['GET', 'POST', 'PUT', 'PATCH'],
        expiresAt: '',
        password: ''
      },
      [permission]
    )
    expect(result.documentId).toBe('file-id')
    expect(result.url).toContain('sharecode=share-code')
  })

  it('creates a link when no existing permission is found', async () => {
    const client = createMockClient({})
    client.getStackClient = () => ({ uri: 'https://cozy.example' })
    client.collection = jest.fn().mockReturnValue({})
    client.capabilities = { flat_subdomains: true }
    const provider = setupProvider(client, { documentType: 'Files' })
    provider.fetchSharingLinks = jest.fn().mockResolvedValue([])
    provider.shareByLink = jest.fn().mockResolvedValue({ data: permission })

    await provider.ensureSharingLink(document, linkAccess)

    expect(provider.shareByLink).toHaveBeenCalledWith(
      document,
      expect.objectContaining({ verbs: ['GET', 'POST', 'PUT', 'PATCH'] })
    )
  })

  it('sends the selected expiry and password when updating a link', async () => {
    const client = createMockClient({})
    client.getStackClient = () => ({ uri: 'https://cozy.example' })
    client.collection = jest.fn().mockReturnValue({})
    client.capabilities = { flat_subdomains: true }
    const provider = setupProvider(client, { documentType: 'Files' })
    const selectedDate = new Date('2100-01-01T12:00:00.000Z')
    provider.fetchSharingLinks = jest.fn().mockResolvedValue([permission])
    provider.updateDocumentPermissions = jest
      .fn()
      .mockResolvedValue([{ data: permission }])

    await provider.ensureSharingLink(document, {
      editingRights: 'readOnly',
      dateEnabled: true,
      selectedDate,
      passwordEnabled: true,
      password: 'secret'
    })

    expect(provider.updateDocumentPermissions).toHaveBeenCalledWith(
      { ...document, id: 'file-id' },
      {
        verbs: ['GET'],
        expiresAt: endOfDay(selectedDate).toISOString(),
        password: 'secret'
      },
      [permission]
    )
  })

  it('updates permissions discovered outside the current store state', async () => {
    const client = createMockClient({})
    client.getStackClient = () => ({ uri: 'https://cozy.example' })
    client.collection = jest.fn().mockReturnValue({})
    client.capabilities = { flat_subdomains: true }
    const provider = setupProvider(client, { documentType: 'Files' })
    const updatePermission = jest.fn().mockResolvedValue({ data: permission })
    provider.permissionCol = { add: updatePermission }
    provider.fetchSharingLinks = jest.fn().mockResolvedValue([permission])
    provider.dispatch = jest.fn()

    await provider.ensureSharingLink(document, linkAccess)

    expect(updatePermission).toHaveBeenCalledTimes(1)
  })
})

describe('revokeSharingLink', () => {
  const PERM = {
    type: 'io.cozy.permissions',
    id: 'perm_1',
    attributes: {
      type: 'share',
      permissions: {
        rule0: { type: 'io.cozy.files', verbs: ['GET'], values: ['file_id'] }
      }
    }
  }

  let provider
  let mockDestroy

  beforeEach(() => {
    mockDestroy = jest.fn().mockResolvedValue({})
    const mockClient = createMockClient({})
    mockClient.getStackClient = () => ({ uri: 'http://cozy.local' })
    mockClient.collection = jest.fn().mockReturnValue({ destroy: mockDestroy })
    provider = setupProvider(
      mockClient,
      {},
      reducer(undefined, addSharingLink(PERM))
    )
  })

  it('uses permissionCol.destroy for a regular file', async () => {
    const regularFile = { _id: 'file_id', id: 'file_id' }
    provider.permissionCol = { destroy: mockDestroy }

    await provider.revokeSharingLink(regularFile)

    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockDestroy).toHaveBeenCalledWith(PERM)
    expect(provider.dispatch).toHaveBeenCalledTimes(1)
  })

  it('uses drivePermissionCollection.destroy for a shared drive file', async () => {
    const driveFile = { _id: 'file_id', id: 'file_id', driveId: 'drive_123' }
    const mockDriveCollection = { destroy: mockDestroy }
    provider.props.client.collection = jest
      .fn()
      .mockReturnValue(mockDriveCollection)

    await provider.revokeSharingLink(driveFile)

    expect(provider.props.client.collection).toHaveBeenCalledWith(
      'io.cozy.permissions',
      { driveId: 'drive_123' }
    )
    expect(mockDestroy).toHaveBeenCalledTimes(1)
    expect(mockDestroy).toHaveBeenCalledWith(PERM)
    expect(provider.dispatch).toHaveBeenCalledTimes(1)
  })
})

describe('updateDocumentPermissions', () => {
  const PERM_DRIVE_FILE = {
    type: 'io.cozy.permissions',
    id: 'perm_drive_file',
    attributes: {
      type: 'share',
      permissions: {
        rule0: {
          type: 'io.cozy.files',
          verbs: ['GET'],
          values: ['file_in_drive']
        }
      },
      shortcodes: { code: 'shortcode123' }
    }
  }

  it('sends only one PATCH request for a shared drive file', async () => {
    const driveFile = {
      _id: 'file_in_drive',
      id: 'file_in_drive',
      driveId: 'drive_123'
    }
    const mockAdd = jest.fn().mockResolvedValue({ data: PERM_DRIVE_FILE })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({ add: mockAdd })

    // Seed the state with exactly one permission (as it would be after a correct shareByLink)
    const provider = setupProvider(
      mockClient,
      {},
      reducer(undefined, addSharingLink(PERM_DRIVE_FILE))
    )
    provider.dispatch = jest.fn()

    await provider.updateDocumentPermissions(driveFile, {
      verbs: ['GET'],
      expiresAt: '',
      password: ''
    })

    expect(mockAdd).toHaveBeenCalledTimes(1)
  })
})

describe('shared drive recipient revocation', () => {
  const SHARED_DRIVE = {
    _id: 'sharing_123',
    id: 'sharing_123',
    type: 'io.cozy.sharings',
    attributes: {
      drive: true,
      owner: true,
      description: 'Shared folder',
      rules: [
        {
          title: 'Shared folder',
          doctype: 'io.cozy.files',
          values: ['folder_123'],
          add: 'none',
          update: 'none',
          remove: 'none'
        }
      ],
      members: [
        {
          status: 'owner',
          email: 'owner@cozy.local',
          instance: 'http://cozy.local'
        },
        {
          status: 'pending',
          email: 'recipient@cozy.local',
          instance: 'http://recipient.cozy.local'
        }
      ]
    }
  }
  const NEW_SHARING = {
    ...SHARED_DRIVE,
    _id: 'sharing_456',
    id: 'sharing_456'
  }
  const document = {
    _id: 'folder_123',
    id: 'folder_123',
    path: '/Shared folder'
  }
  const recipient = {
    _id: 'contact_123',
    id: 'contact_123',
    _type: 'io.cozy.contacts',
    email: 'recipient@cozy.local'
  }

  let provider
  let sharingCol
  let mockClient

  beforeEach(() => {
    mockClient = createMockClient({})
    mockClient.getStackClient = () => ({ uri: 'http://cozy.local' })
    mockClient.collection = jest.fn().mockReturnValue({})

    provider = setupProvider(
      mockClient,
      {},
      reducer(undefined, receiveSharings({ sharings: [SHARED_DRIVE] }))
    )
    sharingCol = {
      addRecipients: jest.fn(),
      create: jest.fn().mockResolvedValue({ data: NEW_SHARING }),
      createSharedDrive: jest.fn(),
      revokeRecipient: jest.fn().mockResolvedValue({}),
      fetchEffectiveRecipients: jest.fn().mockResolvedValue({ data: [] })
    }
    provider.sharingCol = sharingCol
  })

  it('forgets the shared drive when revoking its last recipient', async () => {
    await provider.revoke(document, SHARED_DRIVE.id, 1)

    expect(sharingCol.revokeRecipient).toHaveBeenCalledWith(SHARED_DRIVE, 1)
    expect(getDocumentSharing(provider.state, document.id)).toBeNull()
  })

  it('creates a new sharing when re-adding after the last recipient was revoked', async () => {
    await provider.revoke(document, SHARED_DRIVE.id, 1)

    await provider.share({
      document,
      recipients: [recipient],
      readOnlyRecipients: [],
      description: 'Shared folder',
      openSharing: true,
      sharedDrive: true
    })

    expect(sharingCol.addRecipients).not.toHaveBeenCalled()
    expect(sharingCol.create).toHaveBeenCalledWith({
      document,
      recipients: [recipient],
      readOnlyRecipients: [],
      description: 'Shared folder',
      previewPath: '/preview',
      openSharing: true,
      sharedDrive: true
    })
  })

  it('creates a new sharing when sharing a document nested inside a shared drive without its own sharing', async () => {
    const nestedDocument = {
      _id: 'nested_folder_456',
      id: 'nested_folder_456',
      driveId: SHARED_DRIVE.id,
      path: '/Shared folder/Sub folder'
    }

    await provider.share({
      document: nestedDocument,
      recipients: [recipient],
      readOnlyRecipients: [],
      description: 'Sub folder',
      openSharing: false,
      sharedDrive: true
    })

    expect(sharingCol.create).toHaveBeenCalledWith({
      document: nestedDocument,
      recipients: [recipient],
      readOnlyRecipients: [],
      description: 'Sub folder',
      previewPath: '/preview',
      openSharing: false,
      sharedDrive: true,
      driveId: SHARED_DRIVE.id
    })
    expect(sharingCol.addRecipients).not.toHaveBeenCalled()
    expect(sharingCol.createSharedDrive).not.toHaveBeenCalled()
  })

  it('clears effective recipients when the sharing was deleted (404)', async () => {
    provider.dispatch(
      receiveEffectiveRecipients(document.id, [
        { sharingId: SHARED_DRIVE.id, memberIndex: 1 }
      ])
    )
    sharingCol.fetchEffectiveRecipients.mockRejectedValue(
      Object.assign(new Error('deleted'), { status: 404 })
    )

    await expect(
      provider.fetchEffectiveRecipients(document.id, SHARED_DRIVE.id)
    ).resolves.toBeUndefined()
    expect(getEffectiveRecipients(provider.state, document.id)).toEqual([])
  })

  it('rethrows non-404 errors from fetching effective recipients', async () => {
    sharingCol.fetchEffectiveRecipients.mockRejectedValue(
      Object.assign(new Error('boom'), { status: 500 })
    )

    await expect(
      provider.fetchEffectiveRecipients(document.id, SHARED_DRIVE.id)
    ).rejects.toThrow('boom')
  })
})

describe('revokeSelf', () => {
  const document = { id: 'received-folder', _id: 'received-folder' }
  const sharing = {
    id: 'received-sharing',
    type: 'io.cozy.sharings',
    attributes: {
      owner: false,
      drive: true,
      rules: [{ values: [document.id] }],
      members: []
    }
  }
  const recipients = [{ sharingId: sharing.id, memberIndex: 1 }]
  const forbidden = Object.assign(new Error('Forbidden'), { status: 403 })
  let provider
  let sharingCol

  beforeEach(() => {
    const client = createMockClient({})
    sharingCol = {
      revokeSelf: jest.fn().mockResolvedValue({}),
      fetchEffectiveRecipients: jest.fn().mockRejectedValue(forbidden)
    }
    client.collection = () => sharingCol
    provider = setupProvider(
      client,
      {},
      reducer(undefined, receiveSharings({ sharings: [sharing] }))
    )
    provider.dispatch(receiveEffectiveRecipients(document.id, recipients))
    provider.dispatch(receiveEffectiveRecipients('other-folder', recipients))
  })

  it.each([true, false])(
    'forgets the sharing and clears its recipients without reloading lost access (drive: %s)',
    async drive => {
      provider.state.sharings = [
        { ...sharing, attributes: { ...sharing.attributes, drive } }
      ]

      await provider.revokeSelf(document)

      expect(getDocumentSharing(provider.state, document.id)).toBeNull()
      expect(getEffectiveRecipients(provider.state, document.id)).toEqual([])
      expect(getEffectiveRecipients(provider.state, 'other-folder')).toEqual(
        recipients
      )
      expect(sharingCol.fetchEffectiveRecipients).not.toHaveBeenCalled()
    }
  )

  it.each([403, 500])(
    'preserves sharing state and rejects when self-revocation fails (%s)',
    async status => {
      const error = Object.assign(new Error('Revocation failed'), { status })
      sharingCol.revokeSelf.mockRejectedValue(error)

      await expect(provider.revokeSelf(document)).rejects.toBe(error)

      expect(getDocumentSharing(provider.state, document.id)).toEqual(sharing)
      expect(getEffectiveRecipients(provider.state, document.id)).toEqual(
        recipients
      )
    }
  )

  it('still rejects forbidden recipient refreshes outside self-revocation', async () => {
    await expect(provider.fetchEffectiveRecipients(document.id)).rejects.toBe(
      forbidden
    )

    expect(getEffectiveRecipients(provider.state, document.id)).toEqual(
      recipients
    )
  })
})

describe('share flow reused by PermissionTypeMenu upgrade', () => {
  const PARENT_SHARING = {
    _id: 'parent_sharing',
    id: 'parent_sharing',
    type: 'io.cozy.sharings',
    attributes: {
      drive: true,
      owner: true,
      description: 'Shared folder',
      rules: [
        {
          title: 'Shared folder',
          doctype: 'io.cozy.files',
          values: ['folder_parent'],
          add: 'none',
          update: 'sync',
          remove: 'sync'
        }
      ],
      members: [
        {
          status: 'owner',
          email: 'owner@cozy.local',
          instance: 'http://cozy.local'
        },
        {
          status: 'ready',
          email: 'bob@bob.cozy',
          instance: 'http://bob.cozy.local',
          read_only: true
        }
      ]
    }
  }
  const CHILD_SHARING_BASE = {
    _id: 'child_sharing',
    id: 'child_sharing',
    type: 'io.cozy.sharings',
    attributes: {
      drive: true,
      owner: true,
      description: 'child',
      rules: [
        {
          title: 'child',
          doctype: 'io.cozy.files',
          values: ['folder_child'],
          add: 'none',
          update: 'sync',
          remove: 'sync'
        }
      ],
      members: [
        {
          status: 'owner',
          email: 'owner@cozy.local',
          instance: 'http://cozy.local'
        },
        {
          status: 'ready',
          email: 'bob@bob.cozy',
          instance: 'http://bob.cozy.local',
          read_only: false
        }
      ]
    }
  }
  const childDocument = {
    _id: 'folder_child',
    id: 'folder_child',
    name: 'child',
    path: '/Shared folder/child'
  }
  const bobContact = {
    _id: 'contact_bob',
    id: 'contact_bob',
    _type: 'io.cozy.contacts',
    email: 'bob@bob.cozy'
  }
  const effectiveBob = {
    name: 'Bob',
    email: 'bob@bob.cozy',
    instance: 'http://bob.cozy.local',
    status: 'ready',
    read_only: false,
    sources: [{ sharing_id: 'child_sharing', member_index: 1, kind: 'self' }]
  }

  const setupWithParent = (sharings = [PARENT_SHARING]) => {
    const mockClient = createMockClient({})
    mockClient.getStackClient = () => ({ uri: 'http://cozy.local' })
    mockClient.collection = jest.fn().mockReturnValue({})

    const provider = setupProvider(
      mockClient,
      {},
      reducer(undefined, receiveSharings({ sharings }))
    )
    provider.sharingCol = {
      addRecipients: jest.fn().mockResolvedValue({ data: CHILD_SHARING_BASE }),
      create: jest.fn().mockResolvedValue({ data: CHILD_SHARING_BASE }),
      setReadOnly: jest.fn().mockResolvedValue({}),
      setReadWrite: jest.fn().mockResolvedValue({}),
      fetchEffectiveRecipients: jest
        .fn()
        .mockResolvedValue({ data: [effectiveBob] })
    }
    return provider
  }

  it('creates a child sharing when the child has no direct sharing', async () => {
    const provider = setupWithParent()

    await provider.share({
      document: childDocument,
      recipients: [bobContact],
      readOnlyRecipients: [],
      description: 'child',
      sharedDrive: true,
      openSharing: false
    })

    expect(provider.sharingCol.create).toHaveBeenCalledWith({
      document: childDocument,
      recipients: [bobContact],
      readOnlyRecipients: [],
      description: 'child',
      previewPath: '/preview',
      openSharing: false,
      sharedDrive: true
    })
    expect(provider.sharingCol.addRecipients).not.toHaveBeenCalled()
    expect(provider.sharingCol.setReadWrite).not.toHaveBeenCalled()
    expect(provider.sharingCol.setReadOnly).not.toHaveBeenCalled()
  })

  it('refreshes the child effective recipients as two-way and leaves the parent unchanged', async () => {
    const provider = setupWithParent()

    await provider.share({
      document: childDocument,
      recipients: [bobContact],
      readOnlyRecipients: [],
      description: 'child',
      sharedDrive: true,
      openSharing: false
    })

    expect(provider.sharingCol.fetchEffectiveRecipients).toHaveBeenCalledWith(
      'folder_child',
      { driveId: undefined }
    )
    const effectiveRecipients =
      provider.state.effectiveRecipients['folder_child']
    expect(effectiveRecipients).toHaveLength(1)
    expect(effectiveRecipients[0].email).toBe('bob@bob.cozy')
    expect(effectiveRecipients[0].read_only).toBe(false)
    expect(effectiveRecipients[0].type).toBe('two-way')
    expect(effectiveRecipients[0].sharingId).toBe('child_sharing')
    expect(effectiveRecipients[0].memberIndex).toBe(1)

    const parentSharing = getDocumentSharing(provider.state, 'folder_parent')
    expect(parentSharing.id).toBe('parent_sharing')
    expect(parentSharing.attributes.members[1].read_only).toBe(true)
    expect(getDocumentSharing(provider.state, 'folder_child').id).toBe(
      'child_sharing'
    )
  })

  it('adds the recipient to an existing child sharing and preserves the other member', async () => {
    const otherMember = {
      status: 'ready',
      email: 'other@cozy.local',
      instance: 'http://other.cozy.local',
      read_only: false
    }
    const childSharing = {
      ...CHILD_SHARING_BASE,
      attributes: {
        ...CHILD_SHARING_BASE.attributes,
        members: [CHILD_SHARING_BASE.attributes.members[0], otherMember]
      }
    }
    const updatedSharing = {
      ...childSharing,
      attributes: {
        ...childSharing.attributes,
        members: [
          childSharing.attributes.members[0],
          otherMember,
          {
            status: 'seen',
            email: 'bob@bob.cozy',
            instance: 'http://bob.cozy.local',
            read_only: false
          }
        ]
      }
    }
    const provider = setupWithParent([PARENT_SHARING, childSharing])
    provider.sharingCol.addRecipients = jest
      .fn()
      .mockResolvedValue({ data: updatedSharing })

    await provider.share({
      document: childDocument,
      recipients: [bobContact],
      readOnlyRecipients: [],
      description: 'child',
      sharedDrive: true,
      openSharing: false
    })

    expect(provider.sharingCol.addRecipients).toHaveBeenCalledWith({
      document: childSharing,
      recipients: [bobContact],
      readOnlyRecipients: []
    })
    expect(provider.sharingCol.create).not.toHaveBeenCalled()
    expect(provider.sharingCol.setReadWrite).not.toHaveBeenCalled()

    const childSharingInState = getDocumentSharing(
      provider.state,
      'folder_child'
    )
    expect(childSharingInState.attributes.members.map(m => m.email)).toEqual([
      'owner@cozy.local',
      'other@cozy.local',
      'bob@bob.cozy'
    ])
    expect(provider.sharingCol.fetchEffectiveRecipients).toHaveBeenCalledWith(
      'folder_child',
      { driveId: undefined }
    )

    const parentSharing = getDocumentSharing(provider.state, 'folder_parent')
    expect(parentSharing.attributes.members).toHaveLength(2)
    expect(parentSharing.attributes.members[1].read_only).toBe(true)
  })

  it('leaves the parent unchanged and does not refresh when the child sharing creation fails', async () => {
    const provider = setupWithParent()
    provider.sharingCol.create = jest
      .fn()
      .mockRejectedValue(new Error('Network error'))

    await expect(
      provider.share({
        document: childDocument,
        recipients: [bobContact],
        readOnlyRecipients: [],
        description: 'child',
        sharedDrive: true,
        openSharing: false
      })
    ).rejects.toThrow('Network error')

    expect(provider.sharingCol.fetchEffectiveRecipients).not.toHaveBeenCalled()
    expect(provider.sharingCol.setReadWrite).not.toHaveBeenCalled()
    expect(provider.dispatch).not.toHaveBeenCalled()

    const parentSharing = getDocumentSharing(provider.state, 'folder_parent')
    expect(parentSharing.id).toBe('parent_sharing')
    expect(parentSharing.attributes.members[1].read_only).toBe(true)
    expect(getDocumentSharing(provider.state, 'folder_child')).toBeNull()
  })
})

describe('fetchSharedDriveSharingLinks', () => {
  const PERM_DRIVE_FILE = {
    type: 'io.cozy.permissions',
    id: 'perm_drive_file',
    attributes: {
      type: 'share',
      permissions: {
        rule0: {
          type: 'io.cozy.files',
          verbs: ['GET'],
          values: ['file_in_drive']
        }
      },
      shortcodes: { code: 'shortcode123' }
    }
  }

  const driveFile = {
    _id: 'file_in_drive',
    id: 'file_in_drive',
    driveId: 'drive_123'
  }

  it('fetches shared drive sharing links by file id', async () => {
    const mockFindLinksByIds = jest
      .fn()
      .mockResolvedValue({ data: [PERM_DRIVE_FILE] })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      findLinksByIds: mockFindLinksByIds
    })

    const provider = setupProvider(mockClient)

    const result = await provider.fetchSharedDriveSharingLinks(driveFile)

    expect(mockClient.collection).toHaveBeenCalledWith('io.cozy.permissions', {
      driveId: 'drive_123'
    })
    expect(mockFindLinksByIds).toHaveBeenCalledWith(['file_in_drive'])
    expect(provider.dispatch).toHaveBeenCalled()
    const permissions = getDocumentPermissions(provider.state, 'file_in_drive')
    expect(permissions).toHaveLength(1)
    expect(permissions[0].id).toBe(PERM_DRIVE_FILE.id)
    expect(result).toEqual([PERM_DRIVE_FILE])
  })

  it('returns an empty array and skips the API call for non-shared-drive documents', async () => {
    const mockClient = createMockClient({})
    const findLinksByIds = jest.fn()
    mockClient.collection = jest.fn().mockReturnValue({
      findLinksByIds
    })

    const provider = setupProvider(mockClient)
    provider.dispatch = jest.fn()

    const result = await provider.fetchSharedDriveSharingLinks({
      _id: 'regular_file'
    })

    expect(result).toEqual([])
    expect(findLinksByIds).not.toHaveBeenCalled()
    expect(provider.dispatch).not.toHaveBeenCalled()
  })

  it('uses document.id as a fallback when _id is missing', async () => {
    const mockFindLinksByIds = jest
      .fn()
      .mockResolvedValue({ data: [PERM_DRIVE_FILE] })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      findLinksByIds: mockFindLinksByIds
    })

    const provider = setupProvider(mockClient)

    await provider.fetchSharedDriveSharingLinks({
      id: 'file_in_drive',
      driveId: 'drive_123'
    })

    expect(mockFindLinksByIds).toHaveBeenCalledWith(['file_in_drive'])
  })

  it('does not dispatch when the response has no data', async () => {
    const mockFindLinksByIds = jest.fn().mockResolvedValue({ data: [] })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      findLinksByIds: mockFindLinksByIds
    })

    const provider = setupProvider(mockClient)
    provider.dispatch = jest.fn()

    const result = await provider.fetchSharedDriveSharingLinks(driveFile)

    expect(result).toEqual([])
    expect(provider.dispatch).not.toHaveBeenCalled()
  })
})

describe('shareByLink shared drive 409 recovery', () => {
  const PERM_DRIVE_FILE = {
    type: 'io.cozy.permissions',
    id: 'perm_drive_file',
    attributes: {
      type: 'share',
      permissions: {
        rule0: {
          type: 'io.cozy.files',
          verbs: ['GET'],
          values: ['file_in_drive']
        }
      },
      shortcodes: { code: 'shortcode123' }
    }
  }

  const driveFile = {
    _id: 'file_in_drive',
    id: 'file_in_drive',
    driveId: 'drive_123'
  }

  it('falls back to fetching existing links when create returns 409', async () => {
    const conflict = Object.assign(new Error('Conflict'), { status: 409 })
    const mockCreateSharingLink = jest.fn().mockRejectedValue(conflict)
    const mockFindLinksByIds = jest
      .fn()
      .mockResolvedValue({ data: [PERM_DRIVE_FILE] })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      createSharingLink: mockCreateSharingLink,
      findLinksByIds: mockFindLinksByIds
    })

    const provider = setupProvider(mockClient)

    const resp = await provider.shareByLink(driveFile, { verbs: ['GET'] })

    expect(mockCreateSharingLink).toHaveBeenCalled()
    expect(mockFindLinksByIds).toHaveBeenCalledWith(['file_in_drive'])
    expect(resp.data.id).toBe(PERM_DRIVE_FILE.id)
  })

  it('does not duplicate existing links when 409 recovery refetches them', async () => {
    const conflict = Object.assign(new Error('Conflict'), { status: 409 })
    const mockCreateSharingLink = jest.fn().mockRejectedValue(conflict)
    const mockFindLinksByIds = jest
      .fn()
      .mockResolvedValue({ data: [PERM_DRIVE_FILE] })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      createSharingLink: mockCreateSharingLink,
      findLinksByIds: mockFindLinksByIds
    })

    const provider = setupProvider(
      mockClient,
      {},
      reducer(undefined, addSharingLink(PERM_DRIVE_FILE))
    )

    const resp = await provider.shareByLink(driveFile, { verbs: ['GET'] })

    const permissions = getDocumentPermissions(provider.state, 'file_in_drive')
    expect(resp.data.id).toBe(PERM_DRIVE_FILE.id)
    expect(provider.dispatch).not.toHaveBeenCalled()
    expect(permissions).toHaveLength(1)
  })

  it('rethrows the original error when 409 happens and no link is found', async () => {
    const conflict = Object.assign(new Error('Conflict'), { status: 409 })
    const mockCreateSharingLink = jest.fn().mockRejectedValue(conflict)
    const mockFindLinksByIds = jest.fn().mockResolvedValue({ data: [] })
    const mockClient = createMockClient({})
    mockClient.collection = jest.fn().mockReturnValue({
      createSharingLink: mockCreateSharingLink,
      findLinksByIds: mockFindLinksByIds
    })

    const provider = setupProvider(mockClient)
    provider.dispatch = jest.fn()

    await expect(
      provider.shareByLink(driveFile, { verbs: ['GET'] })
    ).rejects.toBe(conflict)
  })
})

describe('updateSharingMemberType', () => {
  const mockSharing = {
    id: 'sharing-123',
    type: 'io.cozy.sharings',
    attributes: {
      members: [
        { status: 'owner', email: 'owner@cozy.local' },
        { status: 'ready', email: 'bob@bob.cozy' }
      ]
    }
  }

  let instance

  beforeEach(() => {
    const mockClient = {
      getStackClient: () => ({ uri: 'http://cozy.local' }),
      getInstanceOptions: () => ({ subdomain: 'nested' }),
      collection: jest.fn().mockReturnValue({})
    }

    instance = setupProvider(
      mockClient,
      {},
      {
        ...reducer(),
        sharings: [mockSharing]
      }
    )
    instance.sharingCol = {
      setReadOnly: jest.fn().mockResolvedValue({}),
      setReadWrite: jest.fn().mockResolvedValue({}),
      fetchEffectiveRecipients: jest.fn().mockResolvedValue({ data: [] })
    }
  })

  it('should throw when sharing is not found', async () => {
    await expect(
      instance.updateSharingMemberType('unknown-id', 1, 'one-way')
    ).rejects.toThrow('Sharing not found')
  })

  it('should throw when member is not found', async () => {
    await expect(
      instance.updateSharingMemberType('sharing-123', 99, 'one-way')
    ).rejects.toThrow('Member not found')
  })

  it('should call setReadOnly when switching to one-way', async () => {
    await instance.updateSharingMemberType('sharing-123', 1, 'one-way')

    expect(instance.sharingCol.setReadOnly).toHaveBeenCalledWith(mockSharing, 1)
    expect(instance.sharingCol.setReadWrite).not.toHaveBeenCalled()
  })

  it('should call setReadWrite when switching to two-way', async () => {
    await instance.updateSharingMemberType('sharing-123', 1, 'two-way')

    expect(instance.sharingCol.setReadWrite).toHaveBeenCalledWith(
      mockSharing,
      1
    )
    expect(instance.sharingCol.setReadOnly).not.toHaveBeenCalled()
  })

  it('should optimistically dispatch a state update when switching to one-way', async () => {
    await instance.updateSharingMemberType('sharing-123', 1, 'one-way')

    expect(instance.dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SHARING',
      sharing: {
        ...mockSharing,
        attributes: {
          ...mockSharing.attributes,
          members: [
            mockSharing.attributes.members[0],
            {
              ...mockSharing.attributes.members[1],
              read_only: true
            }
          ]
        }
      }
    })
  })

  it('should optimistically dispatch a state update when switching to two-way', async () => {
    await instance.updateSharingMemberType('sharing-123', 1, 'two-way')

    expect(instance.dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SHARING',
      sharing: {
        ...mockSharing,
        attributes: {
          ...mockSharing.attributes,
          members: [
            mockSharing.attributes.members[0],
            {
              ...mockSharing.attributes.members[1],
              read_only: false
            }
          ]
        }
      }
    })
  })

  it('should rethrow error if setReadOnly fails', async () => {
    instance.sharingCol.setReadOnly.mockRejectedValue(
      new Error('Network error')
    )

    await expect(
      instance.updateSharingMemberType('sharing-123', 1, 'one-way')
    ).rejects.toThrow('Network error')
  })

  it('should rethrow error if setReadWrite fails', async () => {
    instance.sharingCol.setReadWrite.mockRejectedValue(
      new Error('Network error')
    )

    await expect(
      instance.updateSharingMemberType('sharing-123', 1, 'two-way')
    ).rejects.toThrow('Network error')
  })

  it('should rollback optimistic state update if API call fails', async () => {
    instance.sharingCol.setReadOnly.mockRejectedValue(
      new Error('Network error')
    )

    await expect(
      instance.updateSharingMemberType('sharing-123', 1, 'one-way')
    ).rejects.toThrow('Network error')

    expect(instance.dispatch).toHaveBeenNthCalledWith(1, {
      type: 'UPDATE_SHARING',
      sharing: {
        ...mockSharing,
        attributes: {
          ...mockSharing.attributes,
          members: [
            mockSharing.attributes.members[0],
            {
              ...mockSharing.attributes.members[1],
              read_only: true
            }
          ]
        }
      }
    })
    expect(instance.dispatch).toHaveBeenNthCalledWith(2, {
      type: 'UPDATE_EFFECTIVE_RECIPIENT',
      sharingId: 'sharing-123',
      memberIndex: 1,
      readOnly: true
    })
    expect(instance.dispatch).toHaveBeenNthCalledWith(3, {
      type: 'UPDATE_SHARING',
      sharing: {
        ...mockSharing,
        attributes: {
          ...mockSharing.attributes,
          members: [
            mockSharing.attributes.members[0],
            {
              ...mockSharing.attributes.members[1],
              read_only: false
            }
          ]
        }
      }
    })
    expect(instance.dispatch).toHaveBeenNthCalledWith(4, {
      type: 'UPDATE_EFFECTIVE_RECIPIENT',
      sharingId: 'sharing-123',
      memberIndex: 1,
      readOnly: false
    })
  })

  it('should preserve realtime changes when rolling back an API failure', async () => {
    const realtimeSharing = {
      ...mockSharing,
      attributes: {
        ...mockSharing.attributes,
        description: 'updated by realtime',
        members: [
          {
            ...mockSharing.attributes.members[0],
            status: 'seen'
          },
          {
            ...mockSharing.attributes.members[1],
            read_only: true
          }
        ]
      }
    }

    instance.sharingCol.setReadOnly.mockImplementation(async () => {
      instance.state = {
        ...instance.state,
        sharings: instance.state.sharings.map(sharing =>
          sharing.id === realtimeSharing.id ? realtimeSharing : sharing
        )
      }
      throw new Error('Network error')
    })

    await expect(
      instance.updateSharingMemberType('sharing-123', 1, 'one-way')
    ).rejects.toThrow('Network error')

    expect(instance.dispatch).toHaveBeenNthCalledWith(2, {
      type: 'UPDATE_EFFECTIVE_RECIPIENT',
      sharingId: 'sharing-123',
      memberIndex: 1,
      readOnly: true
    })
    expect(instance.dispatch).toHaveBeenNthCalledWith(3, {
      type: 'UPDATE_SHARING',
      sharing: {
        ...realtimeSharing,
        attributes: {
          ...realtimeSharing.attributes,
          members: [
            realtimeSharing.attributes.members[0],
            {
              ...realtimeSharing.attributes.members[1],
              read_only: false
            }
          ]
        }
      }
    })
    expect(instance.dispatch).toHaveBeenNthCalledWith(4, {
      type: 'UPDATE_EFFECTIVE_RECIPIENT',
      sharingId: 'sharing-123',
      memberIndex: 1,
      readOnly: false
    })
  })

  it('should refetch effective recipients of the given document through its drive', async () => {
    await instance.updateSharingMemberType('sharing-123', 1, 'one-way', {
      _id: 'nested-folder',
      driveId: 'drive-sharing'
    })

    expect(instance.sharingCol.fetchEffectiveRecipients).toHaveBeenCalledWith(
      'nested-folder',
      { driveId: 'drive-sharing' }
    )
  })

  it('should refetch effective recipients of an owned document locally', async () => {
    await instance.updateSharingMemberType('sharing-123', 1, 'one-way', {
      _id: 'owned-folder'
    })

    expect(instance.sharingCol.fetchEffectiveRecipients).toHaveBeenCalledWith(
      'owned-folder',
      { driveId: undefined }
    )
  })

  it('should not refetch effective recipients without a document', async () => {
    instance.state = {
      ...instance.state,
      byDocId: {
        'drive-root': { sharings: ['sharing-123'], permissions: [] }
      }
    }

    await instance.updateSharingMemberType('sharing-123', 1, 'one-way')

    expect(instance.sharingCol.fetchEffectiveRecipients).not.toHaveBeenCalled()
  })
})

describe('hasWriteAccess', () => {
  const createClient = () => {
    const client = createMockClient({})
    client.getStackClient().uri = 'http://cozy.tools:8080'
    return client
  }

  const parentSharing = {
    id: 'parent-drive',
    type: 'io.cozy.sharings',
    attributes: {
      owner: false,
      drive: true,
      members: [{ read_only: true, instance: 'http://cozy.tools:8080' }],
      rules: [{ values: ['parent-folder'] }]
    }
  }

  const nestedSharing = {
    id: 'nested-drive',
    type: 'io.cozy.sharings',
    attributes: {
      owner: false,
      drive: true,
      members: [{ read_only: false, instance: 'http://cozy.tools:8080' }],
      rules: [{ values: ['nested-folder'] }]
    }
  }

  const ownerSharing = {
    id: 'owner-drive',
    type: 'io.cozy.sharings',
    attributes: {
      owner: true,
      drive: true,
      members: [{ read_only: false, instance: 'http://cozy.tools:8080' }],
      rules: [{ values: ['owner-folder'] }]
    }
  }

  it('returns true when document is not shared and no driveId is provided', () => {
    const provider = setupProvider(createClient())
    expect(provider.hasWriteAccess('unshared-doc')).toBe(true)
  })

  it('returns true when user is owner of the shared document', () => {
    const provider = setupProvider(createClient())
    provider.dispatch(
      receiveSharings({ sharings: [ownerSharing], permissions: [] })
    )
    expect(provider.hasWriteAccess('owner-folder')).toBe(true)
    expect(provider.hasWriteAccess('owner-folder', 'owner-drive')).toBe(true)
  })

  it('returns false for viewer of a shared document', () => {
    const provider = setupProvider(createClient())
    provider.dispatch(
      receiveSharings({ sharings: [parentSharing], permissions: [] })
    )
    expect(provider.hasWriteAccess('parent-folder')).toBe(false)
  })

  it('returns true for editor of a shared document', () => {
    const provider = setupProvider(createClient())
    provider.dispatch(
      receiveSharings({ sharings: [nestedSharing], permissions: [] })
    )
    expect(provider.hasWriteAccess('nested-folder')).toBe(true)
  })

  it('returns drive write access when document has no explicit sharing', () => {
    const provider = setupProvider(createClient())
    provider.dispatch(
      receiveSharings({
        sharings: [parentSharing, nestedSharing],
        permissions: []
      })
    )
    expect(provider.hasWriteAccess('child-file', 'parent-drive')).toBe(false)
    expect(provider.hasWriteAccess('child-file', 'nested-drive')).toBe(true)
  })

  it('takes nested document permissions into account when driveId is provided (issue linagora/twake-drive#4220)', () => {
    const provider = setupProvider(createClient())
    provider.dispatch(
      receiveSharings({
        sharings: [parentSharing, nestedSharing],
        permissions: []
      })
    )
    expect(provider.hasWriteAccess('nested-folder', 'parent-drive')).toBe(true)
  })

  it('takes nested restricted permissions into account when driveId is editor', () => {
    const provider = setupProvider(createClient())
    provider.dispatch(
      receiveSharings({
        sharings: [parentSharing, nestedSharing],
        permissions: []
      })
    )
    expect(provider.hasWriteAccess('parent-folder', 'nested-drive')).toBe(false)
  })
})
