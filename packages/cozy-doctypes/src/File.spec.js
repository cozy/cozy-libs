import { cozyClient } from './testUtils'

import CozyFile from './File'

const destroySpy = jest.fn().mockName('destroy')
const getSpy = jest.fn().mockName('get')
const statByPathSpy = jest.fn().mockName('statByPath')
const updateFileMetadataSpy = jest.fn().mockName('updateFileMetadata')

beforeAll(() => {
  cozyClient.stackClient.collection.mockReturnValue({
    destroy: destroySpy,
    get: getSpy,
    statByPath: statByPathSpy,
    updateFileMetadata: updateFileMetadataSpy
  })

  CozyFile.registerClient(cozyClient)
})

describe('File model', () => {
  describe('getFullpath', () => {
    let parentDirPath

    beforeEach(() => {
      getSpy.mockImplementation(() =>
        Promise.resolve({
          data: {
            path: parentDirPath
          }
        })
      )
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should return the full path of the file', async () => {
      parentDirPath = '/GrandParent/Parent'
      const result = await CozyFile.getFullpath('parent', 'mydoc.odt')
      expect(cozyClient.stackClient.collection).toHaveBeenCalledWith(
        'io.cozy.files'
      )
      expect(getSpy).toHaveBeenCalledWith('parent')
      expect(result).toEqual('/GrandParent/Parent/mydoc.odt')
    })

    it('should return the full path of the file if it is in root directory', async () => {
      parentDirPath = '/'
      const result = await CozyFile.getFullpath('parent', 'mydoc.odt')
      expect(cozyClient.stackClient.collection).toHaveBeenCalledWith(
        'io.cozy.files'
      )
      expect(getSpy).toHaveBeenCalledWith('parent')
      expect(result).toEqual('/mydoc.odt')
    })
  })

  describe('move', () => {
    const fileId = 'file-2295478c'
    const folderId = 'dir-b1e1c256'

    afterEach(() => {
      jest.restoreAllMocks()
      jest.clearAllMocks()
    })

    it('should move a file to another destination', async () => {
      updateFileMetadataSpy.mockResolvedValue({
        data: {
          id: fileId,
          dir_id: folderId,
          _type: 'io.cozy.files'
        }
      })
      const result = await CozyFile.move(fileId, { folderId })
      expect(updateFileMetadataSpy).toHaveBeenCalled()
      expect(result).toEqual({
        deleted: null,
        moved: {
          id: 'file-2295478c',
          dir_id: 'dir-b1e1c256',
          _type: 'io.cozy.files'
        }
      })
    })

    it('should fail with an error if there is a conflict and force is false', async () => {
      updateFileMetadataSpy.mockRejectedValueOnce({
        status: 409
      })
      try {
        await CozyFile.move(fileId, { folderId })
      } catch (e) {
        expect(e).toEqual({ status: 409 })
      }
    })

    it('should overwrite the destination if there is a conflict and force is true', async () => {
      const DELETED_FILE_ID = 'deleted-c097ffca'

      updateFileMetadataSpy.mockRejectedValueOnce({
        status: 409
      })
      updateFileMetadataSpy.mockResolvedValue({
        data: {
          id: fileId,
          dir_id: folderId,
          _type: 'io.cozy.files'
        }
      })
      getSpy.mockResolvedValue({
        data: {
          id: fileId,
          name: 'mydoc.odt',
          _type: 'io.cozy.files'
        }
      })
      statByPathSpy.mockResolvedValue({
        data: {
          id: DELETED_FILE_ID,
          _type: 'io.cozy.files'
        }
      })
      const result = await CozyFile.move(fileId, { folderId }, true)
      expect(updateFileMetadataSpy).toHaveBeenCalled()
      expect(destroySpy).toHaveBeenCalled()
      expect(result).toEqual({
        deleted: DELETED_FILE_ID,
        moved: {
          id: 'file-2295478c',
          dir_id: 'dir-b1e1c256',
          _type: 'io.cozy.files'
        }
      })
    })

    it('should use destination.path if it is given', async () => {
      const DELETED_FILE_ID = 'deleted-c097ffca'

      updateFileMetadataSpy.mockRejectedValueOnce({
        status: 409
      })
      updateFileMetadataSpy.mockResolvedValue({
        data: {
          id: fileId,
          dir_id: folderId,
          _type: 'io.cozy.files'
        }
      })
      statByPathSpy.mockResolvedValue({
        data: {
          id: DELETED_FILE_ID,
          _type: 'io.cozy.files'
        }
      })
      const result = await CozyFile.move(
        fileId,
        { folderId, path: '/mydir/mydoc.odt' },
        true
      )
      expect(getSpy).not.toHaveBeenCalled()
      expect(updateFileMetadataSpy).toHaveBeenCalled()
      expect(destroySpy).toHaveBeenCalled()
      expect(result).toEqual({
        deleted: DELETED_FILE_ID,
        moved: {
          id: 'file-2295478c',
          dir_id: 'dir-b1e1c256',
          _type: 'io.cozy.files'
        }
      })
    })
  })
})
