import { models } from 'cozy-client'

import { handleConflictFilename } from './handleConflictFilename'

const {
  file: { getFullpath }
} = models

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  models: {
    file: {
      ...jest.requireActual('cozy-client/dist/models/file'),
      getFullpath: jest.fn()
    }
  }
}))

const setup = ({ fullpath, filename } = {}) => {
  const currentFilename = fullpath.split('/').pop()
  const statByPathReturn =
    currentFilename !== filename
      ? jest.fn().mockRejectedValue({ message: 'Not Found' })
      : jest
          .fn()
          .mockResolvedValueOnce({ data: [{ name: filename }] })
          .mockRejectedValue({ message: 'Not Found' })
  const client = {
    collection: jest.fn(() => ({
      statByPath: statByPathReturn
    }))
  }
  getFullpath.mockReturnValue(fullpath)

  return client
}

describe('handleConflictFilename', () => {
  it('should return the name passed as argument', async () => {
    const filename = 'fileA.zip'
    const client = setup({
      fullpath: '/path/to/fileB.zip',
      filename
    })

    const res = await handleConflictFilename(client, 'folderId', filename)

    expect(res).toBe('fileA.zip')
  })

  it('should return the suffixed name passed as argument', async () => {
    const filename = 'fileB.zip'
    const client = setup({
      fullpath: '/path/to/fileB.zip',
      filename
    })

    const res = await handleConflictFilename(client, 'folderId', filename)

    expect(res).toBe('fileB_1.zip')
  })
})
