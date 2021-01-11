/* eslint-env jest */

import client from 'cozy-client'

import { addPermission } from 'connections/permissions'

jest.mock('cozy-client', () => ({
  collection: jest.fn().mockReturnValue({
    add: jest.fn()
  })
}))

const fixtures = {
  konnector: {
    _id: 'konnectest',
    slug: 'konnectest'
  },
  addedPermission: {
    data: {
      type: 'io.cozy.permissions',
      attributes: {
        source_id: 'io.cozy.konnectors/konnectest',
        permissions: {
          saveFolder: {
            type: 'io.cozy.files',
            verbs: ['GET', 'PUT'],
            values: ['0ab48d4150ca4cc9bf581b4b8ecc20dd']
          }
        }
      }
    }
  },
  permission: {
    saveFolder: {
      type: 'io.cozy.files',
      verbs: ['GET', 'PUT'],
      values: ['0ab48d4150ca4cc9bf581b4b8ecc20dd']
    }
  }
}

describe('Permissions mutations', () => {
  beforeAll(() => {
    client
      .collection()
      .add.mockResolvedValue({ data: fixtures.addedPermission })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('addPermission', () => {
    it('calls Cozy Client and return io.cozy.permissions document', async () => {
      await addPermission(client, fixtures.konnector, fixtures.permission)
      expect(client.collection().add).toHaveBeenCalledWith(
        fixtures.konnector,
        fixtures.permission
      )
    })
  })
})
