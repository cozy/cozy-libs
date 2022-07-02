import { fetchCustomPaperDefinitions } from './fetchCustomPaperDefinitions'
import getOrCreateAppFolderWithReference from '../helpers/getFolderWithReference'

jest.mock('../helpers/getFolderWithReference', () => jest.fn())

describe('fetchCustomPaperDefinitions', () => {
  const t = jest.fn()
  const mockClient = mockData => {
    const client = {
      query: jest.fn(() => ({
        data: mockData ? [mockData] : []
      }))
      // collection: jest.fn(() => ({
      //   fetchFileContentById: jest.fn(() => ({
      //     json: jest.fn().mockReturnValue(`{ "key01": "value01" }`)
      //   }))
      // }))
    }
    return client
  }

  it('should return object with data if file found', async () => {
    getOrCreateAppFolderWithReference.mockReturnValue({
      _id: '',
      path: '/Path/To/File'
    })
    const mockData = { _id: '001', name: 'file01' }
    const client = mockClient(mockData)
    const res = await fetchCustomPaperDefinitions(client, t)

    expect(res).toEqual({
      paperConfigFilenameCustom: 'papersDefinitions.json',
      appFolderPath: '/Path/To/File',
      file: mockData
    })
  })

  it('should return empty array if file not found', async () => {
    getOrCreateAppFolderWithReference.mockReturnValue({
      _id: '',
      path: ''
    })
    const client = mockClient()
    const res = await fetchCustomPaperDefinitions(client, t)

    expect(res).toEqual({
      paperConfigFilenameCustom: 'papersDefinitions.json',
      appFolderPath: '',
      file: null
    })
  })
})
