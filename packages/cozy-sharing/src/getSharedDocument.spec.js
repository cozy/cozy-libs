import getSharedDocument from './getSharedDocument'

function setupClient(verbs = []) {
  return {
    collection: () => ({
      getOwnPermissions: jest.fn().mockReturnValue({
        data: {
          attributes: {
            permissions: {
              collection: {
                type: 'io.cozy.photos.albums',
                verbs,
                values: ['myshareid']
              },
              files: {
                selector: 'referenced_by',
                type: 'io.cozy.files',
                values: ['io.cozy.photos.albums/myshareid'],
                verbs
              }
            }
          }
        }
      })
    })
  }
}

describe('Getting the shared document', () => {
  it('should get the id', async () => {
    const client = setupClient(['GET'])
    const { id } = await getSharedDocument(client)
    expect(id).toEqual('myshareid')
  })

  it('should return isReadOnly is true when we have only a GET permission', async () => {
    const client = setupClient(['GET'])
    const { isReadOnly } = await getSharedDocument(client)
    expect(isReadOnly).toBeTruthy()
  })

  it('should return isReadOnly is false when we have an ALL permission', async () => {
    const client = setupClient(['ALL'])
    const { isReadOnly } = await getSharedDocument(client)
    expect(isReadOnly).toBeFalsy()
  })

  it('should return isReadOnly is false when we have a PATCH permission', async () => {
    const client = setupClient(['GET', 'PATCH', 'PUT'])
    const { isReadOnly } = await getSharedDocument(client)
    expect(isReadOnly).toBeFalsy()
  })
})
