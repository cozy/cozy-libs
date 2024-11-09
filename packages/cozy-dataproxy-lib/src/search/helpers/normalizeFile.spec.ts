import CozyClient from 'cozy-client'
import { IOCozyContact, IOCozyFile } from 'cozy-client/types/types'

import {
  addFilePaths,
  computeFileFullpath,
  normalizeFileWithFolders,
  shouldKeepFile
} from './normalizeFile'
import { cleanFilePath } from './normalizeSearchResult'
import { FILES_DOCTYPE } from '../consts'
import { queryDocById } from '../queries'
import { CozyDoc } from '../types'

jest.mock('../queries', () => ({
  queryDocById: jest.fn()
}))

const client = new CozyClient()

describe('normalizeFileWithFolders', () => {
  test('should get path for directories', () => {
    const folders = [] as IOCozyFile[]

    const file = {
      type: 'directory',
      dir_id: 'SOME_DIR_ID',
      path: 'SOME/PATH/'
    } as IOCozyFile

    const result = normalizeFileWithFolders(folders, file)

    expect(result).toStrictEqual({
      type: 'directory',
      _type: 'io.cozy.files',
      dir_id: 'SOME_DIR_ID',
      path: 'SOME/PATH/'
    })
  })

  test('should get empty path for directories with missing path attribute', () => {
    const folders = [] as IOCozyFile[]

    const file = {
      type: 'directory',
      dir_id: 'SOME_DIR_ID'
    } as IOCozyFile

    const result = normalizeFileWithFolders(folders, file)

    expect(result).toStrictEqual({
      type: 'directory',
      _type: 'io.cozy.files',
      dir_id: 'SOME_DIR_ID',
      path: ''
    })
  })

  test(`should get parent folder's path for files`, () => {
    const folders = [
      {
        type: 'directory',
        _id: 'SOME_DIR_ID',
        path: 'SOME/PARENT/PATH/'
      }
    ] as IOCozyFile[]

    const file = {
      type: 'file',
      dir_id: 'SOME_DIR_ID'
    } as IOCozyFile

    const result = normalizeFileWithFolders(folders, file)

    expect(result).toStrictEqual({
      type: 'file',
      _type: 'io.cozy.files',
      dir_id: 'SOME_DIR_ID',
      path: 'SOME/PARENT/PATH/'
    })
  })

  test(`should get empty path for files when parent forlder is missing path attribute`, () => {
    const folders = [
      {
        type: 'directory',
        _id: 'SOME_DIR_ID'
      }
    ] as IOCozyFile[]

    const file = {
      type: 'file',
      dir_id: 'SOME_DIR_ID'
    } as IOCozyFile

    const result = normalizeFileWithFolders(folders, file)

    expect(result).toStrictEqual({
      type: 'file',
      _type: 'io.cozy.files',
      dir_id: 'SOME_DIR_ID',
      path: ''
    })
  })
})

describe('addFilePaths', () => {
  test(`should add parent folder's path to files`, () => {
    const client = {
      getCollectionFromState: jest.fn().mockReturnValue([
        {
          type: 'directory',
          _type: 'io.cozy.files',
          _id: 'SOME_DIR_ID',
          path: 'SOME/PARENT/PATH'
        }
      ])
    } as unknown as CozyClient

    const docs = [
      {
        _id: 'SOME_FILE_ID',
        _type: 'io.cozy.files',
        type: 'file',
        dir_id: 'SOME_DIR_ID'
      }
    ] as CozyDoc[]

    const result = addFilePaths(client, docs)

    expect(result).toStrictEqual([
      {
        _id: 'SOME_FILE_ID',
        _type: 'io.cozy.files',
        type: 'file',
        dir_id: 'SOME_DIR_ID',
        path: 'SOME/PARENT/PATH'
      }
    ])
  })

  test(`should handle no files in results`, () => {
    const client = {} as unknown as CozyClient
    const result = addFilePaths(client, [])

    expect(result).toStrictEqual([])
  })

  test(`should handle when no parent dir is found`, () => {
    const client = {
      getCollectionFromState: jest.fn().mockReturnValue([])
    } as unknown as CozyClient

    const docs = [
      {
        _id: 'SOME_FILE_ID',
        _type: 'io.cozy.files',
        type: 'file',
        dir_id: 'SOME_DIR_ID'
      }
    ] as CozyDoc[]

    const result = addFilePaths(client, docs)

    expect(result).toStrictEqual([
      {
        _id: 'SOME_FILE_ID',
        _type: 'io.cozy.files',
        type: 'file',
        dir_id: 'SOME_DIR_ID'
      }
    ])
  })
})

describe('shouldKeepFile', () => {
  test(`should return true for expected files`, () => {
    const file = {
      _id: 'SOME_FILE_ID',
      _type: 'io.cozy.files',
      type: 'file',
      dir_id: 'SOME_DIR_ID'
    } as unknown as IOCozyFile

    const result = shouldKeepFile(file)

    expect(result).toBe(true)
  })

  test(`should return false for trashed files`, () => {
    const file = {
      _id: 'SOME_FILE_ID',
      _type: 'io.cozy.files',
      type: 'file',
      dir_id: 'SOME_DIR_ID',
      trashed: true
    } as unknown as IOCozyFile

    const result = shouldKeepFile(file)

    expect(result).toBe(false)
  })

  test(`should return false for files in trash`, () => {
    const file = {
      _id: 'SOME_DIR_ID',
      _type: 'io.cozy.files',
      type: 'file',
      path: '/.cozy_trash/SOME_FILE'
    } as unknown as IOCozyFile

    const result = shouldKeepFile(file)

    expect(result).toBe(false)
  })

  test(`should return false for root dir`, () => {
    const file = {
      _id: 'io.cozy.files.root-dir',
      _type: 'io.cozy.files',
      type: 'directory'
    } as unknown as IOCozyFile

    const result = shouldKeepFile(file)

    expect(result).toBe(false)
  })

  test(`should return false for shared drives`, () => {
    const file = {
      _id: 'io.cozy.files.shared-drives-dir',
      _type: 'io.cozy.files',
      type: 'directory'
    } as unknown as IOCozyFile

    const result = shouldKeepFile(file)

    expect(result).toBe(false)
  })
})

describe('computeFileFullpath', () => {
  const dir = {
    _id: '123',
    _type: 'io.cozy.files',
    type: 'directory',
    dir_id: 'ROOT',
    name: 'MYDIR',
    path: 'ROOT/MYDIR'
  } as IOCozyFile
  const fileWithFullpath = {
    _id: '456',
    _type: 'io.cozy.files',
    type: 'file',
    dir_id: '123',
    name: 'file1',
    path: 'ROOT/MYDIR/file1'
  } as IOCozyFile
  const fileWithStackPath = {
    _id: '789',
    _type: 'io.cozy.files',
    type: 'file',
    dir_id: '123',
    name: 'file2',
    path: 'ROOT/MYDIR'
  } as IOCozyFile
  const filewithNoPath = {
    _id: '000',
    _type: 'io.cozy.files',
    type: 'file',
    dir_id: '123',
    name: 'file3'
  } as IOCozyFile
  it('should handle directory', async () => {
    const res = await computeFileFullpath(client, dir)
    expect(res).toEqual(dir)
  })

  it('should handle file with complete path', async () => {
    const res = await computeFileFullpath(client, fileWithFullpath)
    expect(res).toEqual(fileWithFullpath)
  })

  it('should compute fullpath for file with incomplete path', async () => {
    const res = await computeFileFullpath(client, fileWithStackPath)
    expect(res.path).toEqual('ROOT/MYDIR/file2')
  })

  it('should compute fullpath for file with no path', async () => {
    // eslint-disable-next-line prettier/prettier
    (queryDocById as jest.Mock).mockResolvedValue(dir)

    const res = await computeFileFullpath(client, filewithNoPath)

    expect(res.path).toEqual('ROOT/MYDIR/file3')
  })
})

describe('cleanFilePath', () => {
  it('should return the document unchanged if it is not an IOCozyFile', () => {
    const doc = { fullname: 'name' } as IOCozyContact
    expect(cleanFilePath(doc)).toEqual(doc)
  })

  it('should return the document unchanged if path is undefined', () => {
    const doc = { _type: FILES_DOCTYPE, name: 'name' } as IOCozyFile
    expect(cleanFilePath(doc)).toEqual(doc)
  })

  it('should remove name from path if path ends with name', () => {
    const doc = {
      _type: FILES_DOCTYPE,
      path: '/the/path/myname',
      name: 'myname'
    } as IOCozyFile
    const expected = { ...doc, path: '/the/path' }

    expect(cleanFilePath(doc)).toEqual(expected)
  })

  it('should return the document unchanged if path does not end with name', () => {
    const doc = {
      _type: FILES_DOCTYPE,
      path: '/the/path/othername',
      name: 'name'
    } as IOCozyFile
    expect(cleanFilePath(doc)).toEqual(doc)
  })
})
