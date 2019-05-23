import { cozyClient } from './testUtils'

import CozyFile from './File'

describe('File model', () => {
  describe('getFullpath', () => {
    let parentDirPath
    const getSpy = jest.fn()

    beforeAll(() => {
      getSpy.mockImplementation(() =>
        Promise.resolve({
          data: {
            path: parentDirPath
          }
        })
      )
      cozyClient.stackClient.collection.mockReturnValue({
        get: getSpy
      })

      CozyFile.registerClient(cozyClient)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should return the full path of the file', async () => {
      parentDirPath = '/GrandParent/Parent'
      const result = await CozyFile.getFullpath('parent', 'mydoc.odt')
      expect(cozyClient.stackClient.collection).toHaveBeenCalledWith(
        'io.cozy.files'
      )
      expect(getSpy).toHaveBeenCalledWith('parent')
      expect(result).toEqual('/GrandParent/Parent/mydoc.odt')
    })

    it('should return the full path of the file if it is in root directory', async () => {
      parentDirPath = '/'
      const result = await CozyFile.getFullpath('parent', 'mydoc.odt')
      expect(cozyClient.stackClient.collection).toHaveBeenCalledWith(
        'io.cozy.files'
      )
      expect(getSpy).toHaveBeenCalledWith('parent')
      expect(result).toEqual('/mydoc.odt')
    })
  })
})
