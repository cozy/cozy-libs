import { fetchContentFileToJson } from 'src/utils/fetchContentFileToJson'

describe('fetchContentFileToJson', () => {
  const mockClient = expected => {
    const client = {
      collection: jest.fn(() => ({
        fetchFileContentById: jest.fn(() => ({
          json: jest.fn().mockReturnValue(expected)
        }))
      }))
    }
    return client
  }
  const mockData = { _id: '001', name: 'file01' }
  const expected = `{ "key01": "value01" }`

  it('should return JSON data', async () => {
    const client = mockClient(expected)
    const res = await fetchContentFileToJson(client, mockData)

    expect(res).toEqual(expected)
  })

  it('should return null', async () => {
    const client = mockClient(expected)
    const res = await fetchContentFileToJson(client, null)

    expect(res).toEqual(null)
  })
})
