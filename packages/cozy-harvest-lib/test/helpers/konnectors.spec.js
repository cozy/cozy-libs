import { buildFolderPermission, needsFolder } from 'helpers/konnectors'

const fixtures = {
  folder: {
    _id: '006704d25afb417b9a279a758a08a964'
  }
}

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

  describe('buildFolderPermission', () => {
    it('should return permission', () => {
      expect(buildFolderPermission(fixtures.folder)).toEqual({
        saveFolder: {
          type: 'io.cozy.files',
          values: [fixtures.folder._id],
          verbs: ['GET', 'PATCH', 'POST']
        }
      })
    })
  })
})
