import { models } from 'cozy-client'
const { ensureMagicFolder, getReferencedFolder } = models.folder

import getOrCreateFolderWithReference from 'src/helpers/getFolderWithReference'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  models: {
    folder: {
      ensureMagicFolder: jest.fn(),
      getReferencedFolder: jest.fn()
    }
  }
}))

const setup = referencedFilesRes => {
  ensureMagicFolder.mockReturnValue(referencedFilesRes)
  getReferencedFolder.mockReturnValue(referencedFilesRes)
}

describe('getFolderWithReference', () => {
  it('should get folder with reference', async () => {
    const referencedFilesRes = {
      id: 'fileId',
      dir_id: 'dirId',
      path: '/file_path'
    }
    setup(referencedFilesRes)

    const res = await getOrCreateFolderWithReference()
    expect(res).toEqual({ id: 'fileId', dir_id: 'dirId', path: '/file_path' })
  })
})
