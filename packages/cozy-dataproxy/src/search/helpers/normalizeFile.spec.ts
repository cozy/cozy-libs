import CozyClient from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import {
  addFilePaths,
  normalizeFileWithFolders,
  shouldKeepFile
} from './normalizeFile'
import { RawSearchResult } from '../types'

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

    const results = [
      {
        doctype: 'io.cozy.files',
        doc: {
          _id: 'SOME_FILE_ID',
          _type: 'io.cozy.files',
          type: 'file',
          dir_id: 'SOME_DIR_ID'
        }
      }
    ] as unknown as RawSearchResult[]

    const result = addFilePaths(client, results)

    expect(result).toStrictEqual([
      {
        doc: {
          _id: 'SOME_FILE_ID',
          _type: 'io.cozy.files',
          type: 'file',
          dir_id: 'SOME_DIR_ID',
          path: 'SOME/PARENT/PATH'
        },
        doctype: 'io.cozy.files'
      }
    ])
  })

  test(`should handle no files in results`, () => {
    const client = {} as unknown as CozyClient

    const results = [] as unknown as RawSearchResult[]

    const result = addFilePaths(client, results)

    expect(result).toStrictEqual([])
  })

  test(`should handle when no parent dir is found`, () => {
    const client = {
      getCollectionFromState: jest.fn().mockReturnValue([])
    } as unknown as CozyClient

    const results = [
      {
        doctype: 'io.cozy.files',
        doc: {
          _id: 'SOME_FILE_ID',
          _type: 'io.cozy.files',
          type: 'file',
          dir_id: 'SOME_DIR_ID'
        }
      }
    ] as unknown as RawSearchResult[]

    const result = addFilePaths(client, results)

    expect(result).toStrictEqual([
      {
        doc: {
          _id: 'SOME_FILE_ID',
          _type: 'io.cozy.files',
          type: 'file',
          dir_id: 'SOME_DIR_ID'
        },
        doctype: 'io.cozy.files'
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
