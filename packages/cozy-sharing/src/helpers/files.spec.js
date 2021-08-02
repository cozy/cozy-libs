import { fetchFilesPaths } from './files'

describe('fetchFilesPaths', () => {
  it('should handle document without path', async () => {
    const mockClient = {
      collection: () => ({
        all: jest.fn().mockReturnValueOnce({
          data: []
        })
      })
    }

    const documents = [
      {
        id: 'SOME_ORGANIZATION_ID',
        name: 'SOME_ORGANISATION',
        _type: 'com.bitwarden.organizations',
        _id: 'SOME_ORGANIZATION_ID'
      }
    ]

    const filePaths = await fetchFilesPaths(
      mockClient,
      'com.bitwarden.organizations',
      documents
    )
    expect(filePaths).toEqual([])
  })

  it('should handle a document with a path', async () => {
    const mockClient = {
      collection: () => ({
        all: jest.fn().mockReturnValueOnce({
          data: [
            {
              id: 'SOME_PARENT_DIR_ID',
              name: 'SOME_PARENT_DIR',
              path: '/some_parent_dir'
            }
          ]
        })
      })
    }

    const documents = [
      {
        id: 'SOME_DOCUMENT_ID',
        name: 'test',
        type: 'io.cozy.files',
        dir_id: 'SOME_PARENT_DIR_ID'
      }
    ]

    const filePaths = await fetchFilesPaths(
      mockClient,
      'io.cozy.files',
      documents
    )
    expect(filePaths).toEqual(['/some_parent_dir/SOME_PARENT_DIR'])
  })
})
