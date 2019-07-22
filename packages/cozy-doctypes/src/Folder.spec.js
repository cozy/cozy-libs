import { cozyClient } from './testUtils'

import CozyFolder from './Folder'

describe('Folder model', () => {
  beforeAll(() => {
    CozyFolder.registerClient(cozyClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should expose reference folders', () => {
    expect(CozyFolder.refs).toBeDefined()
    expect(CozyFolder.refs.ADMINISTRATIVE).toBeDefined()
    expect(CozyFolder.refs.PHOTOS).toBeDefined()
    expect(CozyFolder.refs.PHOTOS_UPLOAD).toBeDefined()
    expect(CozyFolder.refs.PHOTOS_BACKUP).toBeDefined()
  })

  describe('getReferencedFolders', () => {
    it('should filter trashed folders', async () => {
      const referencedFolder = {
        attributes: {
          path: '/Reference/Folder'
        }
      }

      const trashFolder = {
        attributes: {
          path: '/.cozy_trash/Old/Reference/Folder'
        }
      }

      cozyClient.stackClient.collection.mockReturnValue({
        findReferencedBy: jest
          .fn()
          .mockResolvedValue({ included: [referencedFolder, trashFolder] })
      })

      const result = await CozyFolder.getReferencedFolders('ref')

      expect(result).toContain(referencedFolder)
      expect(result).not.toContain(trashFolder)
    })
  })

  describe('ensureFolderWithReference', () => {
    it('should return first folder from returned list', async () => {
      const existingReferencedFolders = [
        {
          attributes: {
            path: '/Reference/Folder'
          }
        },
        {
          attributes: {
            path: '/Another/Reference'
          }
        }
      ]

      jest
        .spyOn(CozyFolder, 'getReferencedFolders')
        .mockResolvedValue(existingReferencedFolders)

      const result = await CozyFolder.ensureFolderWithReference(
        '/Created/Folder',
        {
          _id: '31dd57ab0b154ccc8d0d6cba576c0ef0',
          _type: 'io.cozy.examples'
        }
      )

      expect(result).toEqual(existingReferencedFolders[0])
    })

    it('should create referenced folder', async () => {
      const createdFolderId = '6d8cf41a358c4147bf977e34c476131e'
      const createdFolderInfos = {
        _id: createdFolderId,
        _type: 'io.cozy.files',
        attributes: {
          path: '/Created/Folder'
        }
      }
      const createdFolderResponse = {
        data: createdFolderInfos
      }

      jest.spyOn(CozyFolder, 'getReferencedFolders').mockResolvedValue([])

      jest.spyOn(cozyClient, 'collection').mockReturnValue({
        addReferencesTo: jest.fn(),
        ensureDirectoryExists: jest.fn().mockResolvedValue(createdFolderId),
        get: jest.fn().mockResolvedValue(createdFolderResponse)
      })

      const result = await CozyFolder.ensureFolderWithReference(
        '/Created/Folder',
        {
          _id: '31dd57ab0b154ccc8d0d6cba576c0ef0',
          _type: 'io.cozy.examples'
        }
      )

      expect(
        cozyClient.collection().ensureDirectoryExists
      ).toHaveBeenCalledWith('/Created/Folder')

      expect(cozyClient.collection().addReferencesTo).toHaveBeenCalledWith(
        {
          _id: '31dd57ab0b154ccc8d0d6cba576c0ef0',
          _type: 'io.cozy.examples'
        },
        [{ _id: createdFolderId }]
      )

      expect(result).toEqual(createdFolderInfos)
    })
  })
})
