import { IOCozyFile } from 'cozy-client/types/types'

import { normalizeFileWithFolders } from './normalizeFile'

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
