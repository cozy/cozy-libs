/* eslint-env jest */

import client from 'cozy-client'

import { filesMutations } from 'connections/files'

jest.mock('cozy-client', () => ({
  collection: jest.fn().mockReturnValue({
    createDirectoryByPath: jest.fn(),
    statByPath: jest.fn()
  })
}))

const fixtures = {
  path: '/Administrative/KonnectTest/84595fcbc15242f2a69ac483b37ae999',
  directory: {
    _id: '326267e55ff0511c7f7b9ba56e04b334',
    _rev: '2-510e5a2b3c84aba208c480a91fd39abf',
    type: 'directory',
    name: '84595fcbc15242f2a69ac483b37ae999',
    dir_id: '326267e55ff0511c7f7b9ba56e00ca07',
    created_at: '2018-12-18T11:22:41.065070118+01:00',
    updated_at: '2018-12-18T11:22:41.065070118+01:00',
    tags: [],
    path: '/Administrative/KonnectTest/84595fcbc15242f2a69ac483b37ae999'
  }
}

const { createDirectoryByPath, statDirectoryByPath } = filesMutations(client)

describe('Files mutations', () => {
  beforeAll(() => {
    client
      .collection()
      .createDirectoryByPath.mockResolvedValue({ data: fixtures.directory })

    client
      .collection()
      .statByPath.mockResolvedValue({ data: fixtures.directory })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('createDirectoryByPath', () => {
    it('calls Cozy Client and return io.cozy.files document', async () => {
      const directory = await createDirectoryByPath(fixtures.path)

      expect(client.collection().createDirectoryByPath).toHaveBeenCalledWith(
        fixtures.path
      )
      expect(directory).toEqual(fixtures.directory)
    })
  })

  describe('statDirectoryByPath', () => {
    it('calls Cozy Client and return io.cozy.files data', async () => {
      expect(await statDirectoryByPath(fixtures.path)).toEqual(
        fixtures.directory
      )
    })

    it('returns null if Cozy Client returns a 404 error', async () => {
      client.collection().statByPath.mockRejectedValue({ status: 404 })
      expect(await statDirectoryByPath(fixtures.path)).toBeNull()
    })

    it('throw error if Cozy Client returns any other error', async () => {
      client
        .collection()
        .statByPath.mockRejectedValue({ status: 403, message: 'Test error' })

      await expect(statDirectoryByPath(fixtures.path)).rejects.toThrow(
        'Test error'
      )
    })
  })
})
