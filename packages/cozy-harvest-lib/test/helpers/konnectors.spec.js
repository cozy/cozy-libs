import {
  buildFolderPermission,
  getAccountType,
  KonnectorJobError,
  needsFolder
} from 'helpers/konnectors'

const fixtures = {
  folder: {
    _id: '006704d25afb417b9a279a758a08a964'
  }
}

describe('Konnectors Helpers', () => {
  describe('getAccountType', () => {
    it('should return slug', () => {
      expect(getAccountType({ slug: 'foo' })).toBe('foo')
    })

    it('should return oauth.account_type', () => {
      expect(
        getAccountType({ slug: 'foo', oauth: { account_type: 'bar' } })
      ).toBe('bar')
    })
  })

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

  describe('KonnectorJobError', () => {
    it('should parse error code and type', () => {
      const error = new KonnectorJobError(
        'USER_ACTION_NEEDED.PERMISSIONS_CHANGED'
      )
      expect(error.code).toBe('USER_ACTION_NEEDED.PERMISSIONS_CHANGED')
      expect(error.type).toBe('USER_ACTION_NEEDED')
    })

    for (const message of [
      'DISK_QUOTA_EXCEEDED',
      'CHALLENGE_ASKED',
      'LOGIN_FAILED',
      'LOGIN_FAILED.NEEDS_SECRET',
      'LOGIN_FAILED.TOO_MANY_ATTEMPTS',
      'MAINTENANCE',
      'NOT_EXISTING_DIRECTORY',
      'USER_ACTION_NEEDED',
      'USER_ACTION_NEEDED.OAUTH_OUTDATED',
      'USER_ACTION_NEEDED.ACCOUNT_REMOVED',
      'USER_ACTION_NEEDED.CHANGE_PASSWORD',
      'USER_ACTION_NEEDED.PERMISSIONS_CHANGED',
      'VENDOR_DOWN',
      'VENDOR_DOWN.BANK_DOWN',
      'VENDOR_DOWN.LINXO_DOWN'
    ]) {
      it(`should know ${message} error`, () => {
        const error = new KonnectorJobError(message)
        expect(error.type).not.toBe('UNKNOWN_ERROR')
        expect(error.isLoginError()).toBe(
          [
            'LOGIN_FAILED',
            'LOGIN_FAILED.NEEDS_SECRET',
            'LOGIN_FAILED.TOO_MANY_ATTEMPTS'
          ].includes(message)
        )
        expect(error.isUserError()).toBe(
          [
            'CHALLENGE_ASKED',
            'DISK_QUOTA_EXCEEDED',
            'LOGIN_FAILED',
            'LOGIN_FAILED.NEEDS_SECRET',
            'LOGIN_FAILED.TOO_MANY_ATTEMPTS',
            'NOT_EXISTING_DIRECTORY',
            'USER_ACTION_NEEDED',
            'USER_ACTION_NEEDED.OAUTH_OUTDATED',
            'USER_ACTION_NEEDED.ACCOUNT_REMOVED',
            'USER_ACTION_NEEDED.CHANGE_PASSWORD',
            'USER_ACTION_NEEDED.PERMISSIONS_CHANGED'
          ].includes(message)
        )
      })
    }

    it('should handle unknown konnector error', () => {
      const error = new KonnectorJobError(
        'NOT_YET_IMPLEMENTED.AT_LEAST_IN_HARVEST'
      )
      expect(error.code).toBe('NOT_YET_IMPLEMENTED.AT_LEAST_IN_HARVEST')
      expect(error.type).toBe('UNKNOWN_ERROR')
    })
  })
})
