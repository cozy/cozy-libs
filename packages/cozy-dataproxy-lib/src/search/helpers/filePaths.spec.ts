import CozyClient from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import { setFilePaths, computeFileFullpath, resetAllPaths } from './filePaths'
import { queryDocById } from '../queries'
import { CozyDoc } from '../types'

jest.mock('../queries', () => ({
  queryDocById: jest.fn()
}))

const client = new CozyClient()

describe('setFilePaths', () => {
  afterEach(() => {
    resetAllPaths()
  })

  it(`should add parent folder's path to files`, () => {
    const docs = [
      {
        _id: 'SOME_FILE_ID',
        _type: 'io.cozy.files',
        type: 'file',
        dir_id: 'SOME_DIR_ID',
        name: 'myfile.txt'
      },
      {
        _id: 'SOME_DIR_ID',
        _type: 'io.cozy.files',
        type: 'directory',
        path: '/mydir',
        dir_id: 'ROOT_ID'
      }
    ] as CozyDoc[]

    const result = setFilePaths(docs)

    expect(result[0]).toStrictEqual({
      _id: 'SOME_FILE_ID',
      _type: 'io.cozy.files',
      type: 'file',
      dir_id: 'SOME_DIR_ID',
      name: 'myfile.txt',
      path: '/mydir/myfile.txt'
    })
  })

  it(`should handle no files in results`, () => {
    const result = setFilePaths([])
    expect(result).toStrictEqual([])
  })

  it(`should handle when no parent dir is found`, () => {
    const docs = [
      {
        _id: 'SOME_FILE_ID',
        _type: 'io.cozy.files',
        type: 'file',
        dir_id: 'SOME_DIR_ID'
      }
    ] as CozyDoc[]

    const result = setFilePaths(docs)

    expect(result).toStrictEqual([
      {
        _id: 'SOME_FILE_ID',
        _type: 'io.cozy.files',
        type: 'file',
        dir_id: 'SOME_DIR_ID',
        path: ''
      }
    ])
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

describe('it should correctly handle in-memory paths', () => {
  beforeEach(() => {
    resetAllPaths()
  })

  const dir = {
    _id: '123',
    _type: 'io.cozy.files',
    type: 'directory',
    dir_id: 'ROOT',
    name: 'MYDIR',
    path: 'ROOT/MYDIR'
  } as IOCozyFile
  const filewithNoPath = {
    _id: '000',
    _type: 'io.cozy.files',
    type: 'file',
    dir_id: '123',
    name: 'file3'
  } as IOCozyFile

  it('should compute correct path on file', async () => {
    setFilePaths([dir, filewithNoPath])
    const res = await computeFileFullpath(client, filewithNoPath)
    expect(res.path).toEqual('ROOT/MYDIR/file3')
  })

  it('should compute correct path on file after rename', async () => {
    setFilePaths([dir, filewithNoPath])
    const newFileWithFullPath = { ...filewithNoPath, name: 'file4' }
    const res = await computeFileFullpath(client, newFileWithFullPath)
    expect(res.path).toEqual('ROOT/MYDIR/file4')
  })
})
