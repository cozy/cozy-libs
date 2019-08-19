const { cozyClient } = require('./testUtils')
const CozyFolder = require('./Folder')

describe('Folder model', () => {
  beforeAll(() => {
    CozyFolder.registerClient(cozyClient)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should expose magic folders', () => {
    expect(CozyFolder.magicFolders).toBeDefined()
    expect(CozyFolder.magicFolders.ADMINISTRATIVE).toBeDefined()
    expect(CozyFolder.magicFolders.PHOTOS).toBeDefined()
    expect(CozyFolder.magicFolders.PHOTOS_UPLOAD).toBeDefined()
    expect(CozyFolder.magicFolders.PHOTOS_BACKUP).toBeDefined()
  })

  describe('ensureMagicFolder', () => {
    beforeEach(() => {
      jest.spyOn(CozyFolder, 'getReferencedFolders').mockResolvedValue([])
    })

    it('should return first existing magic folder', async () => {
      const existingMagicFolders = [
        {
          attributes: {
            path: '/Administrative'
          }
        },
        {
          attributes: {
            path: '/Administrative2'
          }
        }
      ]

      jest
        .spyOn(CozyFolder, 'getReferencedFolders')
        .mockResolvedValue(existingMagicFolders)

      const result = await CozyFolder.ensureMagicFolder(
        CozyFolder.magicFolders.ADMINISTRATIVE
      )
      expect(result).toEqual(existingMagicFolders[0])
    })

    it('should throw if magic folder id is invalid', async () => {
      await expect(
        CozyFolder.ensureMagicFolder('io.cozy.apps/unexpected/magic/folder')
      ).rejects.toThrow()
    })

    it('should throw if path is missing', async () => {
      await expect(
        CozyFolder.ensureMagicFolder(CozyFolder.magicFolders.ADMINISTRATIVE)
      ).rejects.toThrow()
    })

    it('should create magic folder', async () => {
      const expectedCreatedFolder = {
        attributes: {
          path: '/Administrative'
        }
      }

      jest
        .spyOn(CozyFolder, 'createFolderWithReference')
        .mockResolvedValue(expectedCreatedFolder)

      const result = await CozyFolder.ensureMagicFolder(
        CozyFolder.magicFolders.ADMINISTRATIVE,
        '/Administrative'
      )

      expect(CozyFolder.createFolderWithReference).toHaveBeenCalledWith(
        '/Administrative',
        { _id: CozyFolder.magicFolders.ADMINISTRATIVE, _type: 'io.cozy.apps' }
      )

      expect(result).toEqual(expectedCreatedFolder)
    })
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

describe('Using copyWithClient', () => {
  let MyCozyFolder
  beforeEach(() => {
    const newClient = {}
    MyCozyFolder = CozyFolder.copyWithClient(newClient)
  })

  afterEach(() => {
    CozyFolder.cozyClient = null
  })

  it('should call subfunctions using the same class', () => {
    jest
      .spyOn(MyCozyFolder, 'getReferencedFolders')
      .mockImplementation(() => [])
    jest.spyOn(MyCozyFolder, 'createFolderWithReference').mockImplementation()
    MyCozyFolder.ensureMagicFolder(
      MyCozyFolder.magicFolders.ADMINISTRATIVE,
      '/Administrative'
    )
    expect(MyCozyFolder.getReferencedFolders).toHaveBeenCalled()
  })
})
