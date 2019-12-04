const MockDate = require('mockdate')
const { cozyClient } = require('./testUtils')

const CozyFile = require('./File')

const destroySpy = jest.fn().mockName('destroy')
const getSpy = jest.fn().mockName('get')
const statByPathSpy = jest.fn().mockName('statByPath')
const updateFileMetadataSpy = jest.fn().mockName('updateFileMetadata')
const createFileSpy = jest.fn().mockName('createFileSpy')
const updateFileSpy = jest.fn().mockName('updateFileSpy')

const MOCKED_DATE = new Date('2018-01-01T12:00:00.210Z')

beforeAll(() => {
  MockDate.set(MOCKED_DATE)
  cozyClient.stackClient.collection.mockReturnValue({
    destroy: destroySpy,
    get: getSpy,
    statByPath: statByPathSpy,
    updateFileMetadata: updateFileMetadataSpy,
    createFile: createFileSpy,
    updateFile: updateFileSpy
  })

  CozyFile.registerClient(cozyClient)
})

afterAll(() => {
  MockDate.reset()
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

  describe('splitFilename', () => {
    const name = ({ filename, extension }) => filename + extension
    const file = expectation => ({ type: 'file', name: name(expectation) })
    const { stringify } = JSON

    const scenarios = [
      { filename: 'file', extension: '.ext' },
      { filename: 'file', extension: '' },
      { filename: 'file.html', extension: '.ejs' },
      { filename: 'file', extension: '.' },
      { filename: 'file.', extension: '.' },
      { filename: 'file.', extension: '.ext' },
      { filename: '.file', extension: '' },
      { filename: '.file', extension: '.ext' }
    ]

    for (const expectation of scenarios) {
      it(`splits ${stringify(name(expectation))} into ${stringify(
        expectation
      )}`, () => {
        expect(CozyFile.splitFilename(file(expectation))).toEqual(expectation)
      })
    }

    it('should throw an error if the file is not correct', () => {
      const file = {}

      expect(() => CozyFile.splitFilename(file)).toThrow()
    })
    it('should return only the folder name if its a folder', () => {
      const file = {
        name: 'foo',
        type: 'directory'
      }
      const result = CozyFile.splitFilename(file)
      expect(result).toEqual({
        filename: 'foo',
        extension: ''
      })
    })
  })

  describe('generateNewFileNameOnConflict', () => {
    it('should generate the right file name with _X', () => {
      const filename1 = CozyFile.generateNewFileNameOnConflict('test')
      expect(filename1).toEqual('test_1')
      const filename2 = CozyFile.generateNewFileNameOnConflict('test_1')
      expect(filename2).toEqual('test_2')
      const filename3 = CozyFile.generateNewFileNameOnConflict('test_1_1_test')
      expect(filename3).toEqual('test_1_1_test_1')
      const filename4 = CozyFile.generateNewFileNameOnConflict('test_')
      expect(filename4).toEqual('test__1')
    })
  })

  describe('generateFileNameForRevision', () => {
    it('should generate the right file name for a revision', () => {
      const MOCKED_DATE = '2018-01-01T12:00:00.210Z'
      const expectedFilename = 'test_01 January - 12h00.pdf'
      const date = new Date(MOCKED_DATE)
      const result = CozyFile.generateFileNameForRevision(
        { name: 'test.pdf' },
        { updated_at: date },
        () => '01 January - 12h00'
      )
      expect(result).toEqual(expectedFilename)
    })
  })

  describe('uploadFileWithConflictStrategy', () => {
    beforeEach(() => {
      getSpy.mockImplementation(() =>
        Promise.resolve({
          data: {
            path: '/GrandParent/Parent'
          }
        })
      )
    })
    afterEach(() => {
      jest.restoreAllMocks()
      jest.clearAllMocks()
    })
    it('should use metadata', async () => {
      statByPathSpy.mockRejectedValueOnce(new Error('Not Found'))
      const dirId = 'toto'
      const metadata = {
        classification: '_1',
        subject: { a: 'b' }
      }

      await CozyFile.uploadFileWithConflictStrategy(
        'filename',
        '',
        dirId,
        'rename',
        metadata
      )

      expect(createFileSpy).toHaveBeenCalledWith('', {
        contentType: 'image/jpeg',
        dirId,
        name: 'filename',
        metadata,
        lastModifiedDate: MOCKED_DATE
      })
    })

    it('should use provided ContentType', async () => {
      statByPathSpy.mockRejectedValueOnce(new Error('Not Found'))
      const dirId = 'toto'
      const metadata = {
        classification: '_1',
        subject: { a: 'b' }
      }

      await CozyFile.uploadFileWithConflictStrategy(
        'filename',
        '',
        dirId,
        'rename',
        metadata,
        'application/pdf'
      )

      expect(createFileSpy).toHaveBeenCalledWith('', {
        contentType: 'application/pdf',
        dirId,
        name: 'filename',
        metadata,
        lastModifiedDate: MOCKED_DATE
      })
    })
    it('should call the upload method if no conflict', async () => {
      statByPathSpy.mockRejectedValueOnce(new Error('Not Found'))
      createFileSpy.mockResolvedValue({
        data: {
          id: 'jj',
          dir_id: 'jj',
          _type: 'io.cozy.files'
        }
      })
      try {
        await CozyFile.uploadFileWithConflictStrategy('test', {}, 'a', 'erase')
      } catch (e) {
        expect(createFileSpy).toHaveBeenCalled()
      }
    })

    it('should rename the file if there is a conflict', async () => {
      const dirId = 'toto'
      //first call we return an existing file => conflict
      //second call, we reject as not found
      statByPathSpy
        .mockReturnValueOnce({
          data: {
            id: 'file_id'
          }
        })
        .mockRejectedValueOnce(new Error('Not Found'))

      await CozyFile.uploadFileWithConflictStrategy(
        'filename',
        '',
        dirId,
        'rename',
        {}
      )
      expect(createFileSpy).toHaveBeenCalledWith('', {
        contentType: 'image/jpeg',
        dirId,
        name: 'filename_1',
        metadata: {},
        lastModifiedDate: MOCKED_DATE
      })
    })

    it('should erase the file if there is a conflict', async () => {
      const dirId = 'toto'
      //first call we return an existing file => conflict
      //second call, we reject as not found
      statByPathSpy.mockReturnValueOnce({
        data: {
          id: 'file_id'
        }
      })
      await CozyFile.uploadFileWithConflictStrategy(
        'filename',
        '',
        dirId,
        'erase'
      )
      expect(updateFileSpy).toHaveBeenCalledWith('', {
        fileId: 'file_id',
        dirId,
        name: 'filename'
      })
    })
  })
})
