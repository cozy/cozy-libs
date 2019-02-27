import { needsFolder } from 'helpers/konnectors'

describe('Konnectors Helpers', () => {
  describe('needsFolder', () => {
    it('should return true', () => {
      expect(
        needsFolder({
          fields: {
            advancedFields: {
              folderPath: {
                advanced: true,
                isRequired: false
              }
            }
          }
        })
      ).toBe(true)
    })

    it('should return false', () => {
      expect(needsFolder({})).toBe(false)
    })
  })
})
