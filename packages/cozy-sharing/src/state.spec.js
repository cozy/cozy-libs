import reducer, {
  receiveSharings,
  addSharing,
  addSharingLink,
  updateSharingLink,
  revokeSharingLink,
  getRecipients,
  revokeRecipient,
  revokeSelf,
  matchingInstanceName,
  getSharingLink,
  hasSharedParent,
  hasSharedChild,
  getSharedDocIdsBySharings,
  getSharingType,
  getPermissionDocIds,
  getDocumentSharingType,
  getSharedParentPath,
  getExternalSharingIds
} from './state'
import {
  SHARING_1,
  SHARING_2,
  SHARING_3,
  SHARING_READ_ONLY,
  PERM_1,
  PERM_2,
  PERM_WITHOUT_DOC,
  SHARING_NO_ACTIVE,
  SHARING_WITH_SHORTCUT,
  APPS
} from '../__tests__/fixtures'

describe('Sharing state', () => {
  it('should have a default state', () => {
    const state = reducer()
    expect(state).toEqual({
      byDocId: {},
      sharings: [],
      permissions: [],
      apps: [],
      sharedPaths: []
    })
  })

  it('should index received sharings', () => {
    const state = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2, SHARING_WITH_SHORTCUT]
      })
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] },
      shortcut_id: { sharings: [SHARING_WITH_SHORTCUT.id], permissions: [] },
      previewed_folder_id: {
        sharings: [SHARING_WITH_SHORTCUT.id],
        permissions: []
      }
    })
    expect(state.sharings).toEqual([
      SHARING_1,
      SHARING_2,
      SHARING_WITH_SHORTCUT
    ])
  })

  it('should filter out sharings revoked by all recipients', () => {
    const SHARING_2bis = {
      ...SHARING_2,
      attributes: {
        ...SHARING_2.attributes,
        members: [
          {
            status: 'owner',
            name: 'Jane Doe',
            email: 'jane@doe.com',
            instance: 'http://cozy.tools:8080'
          },
          {
            status: 'revoked',
            name: 'John Doe',
            email: 'john@doe.com',
            instance: 'http://cozy.local:8080'
          }
        ]
      }
    }
    const state = reducer(
      undefined,
      receiveSharings({ sharings: [SHARING_1, SHARING_2bis] })
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] }
    })
    expect(state.sharings).toEqual([SHARING_1])
  })

  it('should index received permissions', () => {
    const state = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2],
        permissions: [PERM_1]
      })
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [PERM_1.id] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
    expect(state.permissions).toEqual([PERM_1])
  })

  it('should index a newly created sharing', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2]
      })
    )
    const newState = reducer(initialState, addSharing(SHARING_3))
    expect(newState.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id, SHARING_3.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
    expect(newState.sharings).toEqual([SHARING_1, SHARING_2, SHARING_3])
  })

  it('should add the path of a sharing shortcut', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: []
      })
    )
    const sharedShortcutPath = 'path/to/shortcut.url'
    const newState = reducer(
      initialState,
      addSharing(SHARING_WITH_SHORTCUT, sharedShortcutPath)
    )
    expect(newState.sharings).toEqual([SHARING_WITH_SHORTCUT])
    expect(newState.sharedPaths).toEqual([sharedShortcutPath])
  })

  it('should revoke a recipient', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      revokeRecipient(SHARING_1, 1)
    )
    expect(state.sharings[0].attributes.members).toHaveLength(
      SHARING_1.attributes.members.length
    )
    expect(state.sharings[0].attributes.members[1].status).toEqual('revoked')
  })

  it('should revoke a recipient even when removing one in the middle', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      revokeRecipient(SHARING_1, 1)
    )
    expect(state.sharings[0].attributes.members).toHaveLength(
      SHARING_1.attributes.members.length
    )
    expect(state.sharings[0].attributes.members[1].status).toEqual('revoked')
    expect(state.sharings[0].attributes.members[2].id).toEqual(
      SHARING_1.attributes.members[2].id
    )
  })

  it('should revoke self', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      revokeSelf(SHARING_1)
    )
    expect(state.byDocId).toEqual({
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
  })

  it('will not add twice the same sharing', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      receiveSharings(SHARING_1)
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
  })

  it('will not add twice the same sharing', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      receiveSharings(SHARING_1)
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
  })

  it('should index a newly created sharing link', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2],
        permissions: [PERM_1]
      })
    )
    const newState = reducer(initialState, addSharingLink(PERM_2))
    expect(newState.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [PERM_1.id] },
      folder_2: { sharings: [SHARING_2.id], permissions: [PERM_2.id] }
    })
    expect(newState.permissions).toEqual([PERM_1, PERM_2])
  })

  it('should update a sharing link', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        permissions: [PERM_1, PERM_2]
      })
    )
    const updatedPerm = { ...PERM_1 }
    updatedPerm.attributes.permissions.rule0.verbs = ['GET', 'POST']

    const newState = reducer(initialState, updateSharingLink(updatedPerm))
    expect(newState.permissions).toEqual([updatedPerm, PERM_2])
  })

  it('should index an array of sharing links', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2],
        permissions: []
      })
    )
    const newState = reducer(initialState, addSharingLink([PERM_1, PERM_2]))
    expect(newState.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [PERM_1.id] },
      folder_2: { sharings: [SHARING_2.id], permissions: [PERM_2.id] }
    })
    expect(newState.permissions).toEqual([PERM_1, PERM_2])
  })

  it('should revoke a sharing link', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2],
        permissions: [PERM_1, PERM_2]
      })
    )
    const newState = reducer(initialState, revokeSharingLink([PERM_1]))
    expect(newState.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [PERM_2.id] }
    })
    expect(newState.permissions).toEqual([PERM_2])
  })

  describe('selectors', () => {
    const state = reducer(
      reducer(
        reducer(
          undefined,
          receiveSharings({
            sharings: [SHARING_1, SHARING_2, SHARING_2, SHARING_WITH_SHORTCUT],
            permissions: [PERM_1],
            apps: APPS
          })
        ),
        addSharing(SHARING_3)
      ),
      addSharing(SHARING_3)
    )

    it('should list all sharing recipients for a doc', () => {
      expect(getRecipients(state, 'folder_1')).toEqual([
        {
          email: 'jane@doe.com',
          instance: 'http://cozy.tools:8080',
          name: 'Jane Doe',
          sharingId: 'sharing_1',
          index: 0,
          status: 'owner',
          type: 'two-way',
          avatarPath: '/sharings/sharing_1/recipients/0/avatar'
        },
        {
          email: 'john@doe.com',
          instance: 'http://cozy.local:8080',
          name: 'John Doe',
          sharingId: 'sharing_1',
          index: 1,
          status: 'ready',
          type: 'two-way',
          avatarPath: '/sharings/sharing_1/recipients/1/avatar'
        },
        {
          email: 'john2@doe.com',
          instance: 'http://cozy.local:8080',
          name: 'John Doe 2',
          sharingId: 'sharing_1',
          index: 2,
          status: 'ready',
          type: 'two-way',
          avatarPath: '/sharings/sharing_1/recipients/2/avatar'
        },
        {
          email: 'johnny@doe.com',
          instance: 'http://cozy.foo:8080',
          name: 'Johnny Doe',
          sharingId: 'sharing_3',
          index: 1,
          status: 'pending',
          type: 'two-way',
          avatarPath: '/sharings/sharing_3/recipients/1/avatar'
        }
      ])

      expect(getRecipients(state, 'shortcut_id')).toEqual([
        {
          email: 'jane@doe.com',
          instance: 'http://cozy.tools:8080',
          name: 'Jane Doe',
          sharingId: 'sharing_5',
          index: 0,
          status: 'owner',
          type: 'one-way',
          avatarPath: '/sharings/sharing_5/recipients/0/avatar'
        },
        {
          email: 'johnny@doe.com',
          instance: 'http://cozy.foo:8080',
          name: 'Johnny Doe',
          sharingId: 'sharing_5',
          index: 1,
          status: 'pending',
          type: 'one-way',
          avatarPath: '/sharings/sharing_5/recipients/1/avatar'
        }
      ])
    })
  })
})

describe('finding matching instance names', () => {
  const instanceURI = 'https://yes.com'

  it('should work in a simple case', () => {
    const members = [{ instance: instanceURI }, { instance: 'https://no.com' }]
    expect(members.find(matchingInstanceName(instanceURI))).toEqual(members[0])
  })

  it('should match instance names with a different casing', () => {
    const members = [
      { instance: 'https://no.com' },
      { instance: 'https://YES.COM' }
    ]
    expect(members.find(matchingInstanceName(instanceURI))).toEqual(members[1])
  })
})

describe('generating a sharing link', () => {
  let state

  beforeEach(() => {
    state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2],
          permissions: [PERM_1, PERM_2],
          apps: APPS
        })
      )
    )
  })

  it('should use the correct app', () => {
    expect(getSharingLink(state, 'folder_1', 'Document')).toBe(
      'https://drive.cozy.tools/public?sharecode=longcode'
    )
    expect(getSharingLink(state, 'folder_1', 'Files')).toBe(
      'https://drive.cozy.tools/public?sharecode=longcode'
    )
    expect(getSharingLink(state, 'folder_1', 'Albums')).toBe(
      'https://photos.cozy.tools/public?sharecode=longcode'
    )
  })

  it('should throw when no app is found', () => {
    expect(() =>
      getSharingLink(state, 'folder_1', 'made up for the test')
    ).toThrow(
      "Sharing link: don't know which app to use for doctype made up for the test"
    )
    state.apps = []
    expect(() => getSharingLink(state, 'folder_1', 'Document')).toThrow(
      'Sharing link: app drive not installed'
    )
  })

  it('should use long codes', () => {
    expect(getSharingLink(state, 'folder_1', 'Document')).toBe(
      'https://drive.cozy.tools/public?sharecode=longcode'
    )
  })

  it('should prefer short codes', () => {
    expect(getSharingLink(state, 'folder_2', 'Document')).toBe(
      'https://drive.cozy.tools/public?sharecode=shortcode'
    )
  })
})

describe('hasSharedParent helper', () => {
  it("should return true if one of the document's parents is shared", () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1', '/dir2/doc1']
    }
    const documentPath = '/dir1/subdir0/doc2'
    const result = hasSharedParent(state, documentPath)
    expect(result).toBe(true)
  })

  it("should return false if none of the document's parents is shared", () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1', '/dir2/doc1']
    }
    const documentPath = '/dir3/doc3'
    const result = hasSharedParent(state, documentPath)
    expect(result).toBe(false)
  })
})

describe('hasSharedChild helper', () => {
  it('returns true if a child is shared', () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1', '/dir2/doc1']
    }
    const documentPath = '/dir0'
    const result = hasSharedChild(state, documentPath)
    expect(result).toBe(true)
  })

  it('returns false if no child is shared', () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1', '/dir2/doc1']
    }
    const documentPath = '/dir3'
    const result = hasSharedChild(state, documentPath)
    expect(result).toBe(false)
  })
})

describe('getSharedDocIdsBySharings method', () => {
  it('should test getSharedDocIdsBySharings', () => {
    const sharedDocsId = getSharedDocIdsBySharings({
      data: [SHARING_1, SHARING_NO_ACTIVE]
    })
    expect(sharedDocsId).toEqual(SHARING_1.attributes.rules[0].values)
  })
})

describe('getPermissionDocIds method', () => {
  it('should return the docs ids for the permission', () => {
    const docs = getPermissionDocIds(PERM_2)
    expect(docs).toEqual(['folder_2'])
  })
  it('should return nothing if there is no document', () => {
    const docs = getPermissionDocIds(PERM_WITHOUT_DOC)
    expect(docs).toEqual([])
  })
})

describe('getSharingType selector', () => {
  it('should return false is this a sharingByLink', () => {
    const newState = reducer({}, addSharingLink(PERM_2))
    expect(
      getSharingType(newState, PERM_2.attributes.permissions.rule0.values, '')
    ).toBe(false)
  })

  it('should return two-way if the sharing is two-way', () => {
    const newState = reducer(
      {},
      receiveSharings({
        sharings: [SHARING_3]
      })
    )
    expect(
      getSharingType(newState, SHARING_3.attributes.rules[0].values[0], '')
    ).toBe('two-way')
  })

  it('should return one-way if the sharing is one-way', () => {
    const newState = reducer(
      {},
      receiveSharings({
        sharings: [SHARING_READ_ONLY]
      })
    )
    expect(
      getSharingType(
        newState,
        SHARING_READ_ONLY.attributes.rules[0].values[0],
        ''
      )
    ).toBe('one-way')
  })
})

describe('getDocumentSharingType', () => {
  it('should return null if no sharing', () => {
    expect(getDocumentSharingType()).toBeNull()
  })

  it('should return one-way or two-way according to the rules', () => {
    expect(
      getDocumentSharingType(
        {
          attributes: {
            rules: [
              {
                values: ['folder_1'],
                update: 'sync',
                remove: 'sync'
              }
            ]
          }
        },
        'folder_1'
      )
    ).toBe('two-way')

    expect(
      getDocumentSharingType(
        {
          attributes: {
            rules: [
              {
                values: ['file_1'],
                update: 'sync',
                remove: 'revoke'
              }
            ]
          }
        },
        'file_1'
      )
    ).toBe('two-way')

    expect(
      getDocumentSharingType(
        {
          attributes: {
            rules: [
              {
                values: ['folder_1'],
                update: 'revoke',
                remove: 'revoke'
              }
            ]
          }
        },
        'folder_1'
      )
    ).toBe('one-way')

    expect(
      getDocumentSharingType(
        {
          attributes: {
            rules: [
              {
                values: ['folder_1'],
                update: 'revoke',
                remove: 'sync'
              }
            ]
          }
        },
        'folder_1'
      )
    ).toBe('one-way')
  })
})

describe('getSharedParentPath', () => {
  const state = {
    sharedPaths: [
      '/folder-1/sub-folder-1',
      '/folder-2',
      '/folder-3/sub-folder-3',
      '/folder-3/sub-folder-4'
    ]
  }

  it('should return null if no shared parent', () => {
    expect(getSharedParentPath(state, '/file-1')).toBeNull()
  })

  it('should return shared parent path', () => {
    expect(getSharedParentPath(state, '/folder-1/sub-folder-1/file-2')).toBe(
      '/folder-1/sub-folder-1'
    )

    expect(getSharedParentPath(state, '/folder-2/sub-folder-2/file-2')).toBe(
      '/folder-2'
    )

    expect(
      getSharedParentPath(state, '/folder-3/sub-folder-4/sub-folder-5/file-4')
    ).toBe('/folder-3/sub-folder-4')
  })
})

/* eslint-disable jest/no-focused-tests */
fdescribe('getExternalSharingIds', () => {
  const getAttributes = (memberStatus = 'mail-not-sent') => ({
    rules: [
      {
        title: 'Photos',
        doctype: 'io.cozy.files',
        values: ['5f8c1090afad686a8f7f56cce07e8098'],
        add: 'sync',
        update: 'sync',
        remove: 'sync'
      }
    ],
    members: [
      {
        status: 'owner',
        name: 'Jane Doe',
        email: 'jane@doe.com',
        instance: 'http://cozy.tools:8080'
      },
      {
        status: memberStatus,
        name: 'John Doe',
        email: 'john@doe.com',
        instance: 'http://cozy.local:8080'
      }
    ]
  })

  it('should add shorcut ', () => {
    const res = getExternalSharingIds(
      {
        attributes: {
          ...getAttributes('ready')
        }
      },
      'http://cozy.local:8080'
    )
    expect(res).toStrictEqual(['5f8c1090afad686a8f7f56cce07e8098'])
  })

  it('should get only shorcut if share is not ready', () => {
    const res = getExternalSharingIds(
      {
        attributes: {
          ...getAttributes(),
          shortcut_id: 'c63de58b2c898e457fbdfdc11a24a986'
        }
      },
      'http://cozy.local:8080'
    )
    expect(res).toStrictEqual(['c63de58b2c898e457fbdfdc11a24a986'])
  })

  it('should add shorcut ', () => {
    const res = getExternalSharingIds(
      {
        attributes: {
          ...getAttributes('ready'),
          shortcut_id: 'c63de58b2c898e457fbdfdc11a24a986'
        }
      },
      'http://cozy.local:8080'
    )
    expect(res).toStrictEqual([
      '5f8c1090afad686a8f7f56cce07e8098',
      'c63de58b2c898e457fbdfdc11a24a986'
    ])
  })
})
