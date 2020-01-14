import {
  buildFolderPath,
  buildFolderPermission,
  getAccountType,
  hasNewVersionAvailable,
  KonnectorJobError,
  needsFolder,
  getErrorLocale,
  getErrorLocaleBound
} from 'helpers/konnectors'

const fixtures = {
  account: {
    _id: '5f344a5e53034124846dd0816909e27c'
  },
  konnector: {
    name: 'Test Konnector',
    slug: 'test-konnector'
  },
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

  describe('buildFolderPath', () => {
    it('should build default path', () => {
      expect(buildFolderPath(fixtures.konnector, fixtures.account)).toEqual(
        '/Administrative/Test Konnector/5f344a5e53034124846dd0816909e27c'
      )
    })

    it('should build localized default path', () => {
      expect(
        buildFolderPath(fixtures.konnector, fixtures.account, {
          administrative: 'My administrative documents'
        })
      ).toEqual(
        '/My administrative documents/Test Konnector/5f344a5e53034124846dd0816909e27c'
      )
    })

    it('should build path from konnector defaultDir', () => {
      const konnector = {
        ...fixtures.konnector,
        folders: [{ defaultDir: '$photos' }]
      }
      expect(
        buildFolderPath(konnector, fixtures.account, { photos: 'Photos' })
      ).toEqual('/Photos/Test Konnector/5f344a5e53034124846dd0816909e27c')
    })

    it('should build path from konnector with defaultPath', () => {
      const konnector = {
        ...fixtures.konnector,
        folders: [{ defaultDir: '/Custom folder/$konnector' }]
      }
      expect(
        buildFolderPath(konnector, fixtures.account, { photos: 'Photos' })
      ).toEqual('/Administrative/Custom folder/Test Konnector')
    })

    it('should build path from konnector with defaultDir and defaultPath', () => {
      const konnector = {
        ...fixtures.konnector,
        folders: [{ defaultDir: '$photos/Custom folder/$konnector' }]
      }
      expect(
        buildFolderPath(konnector, fixtures.account, { photos: 'Photos' })
      ).toEqual('/Photos/Custom folder/Test Konnector')
    })

    it('should add leading slash to path', () => {
      const konnector = {
        ...fixtures.konnector,
        folders: [{ defaultDir: 'custom folder' }]
      }
      expect(buildFolderPath(konnector, fixtures.account)).toEqual(
        '/Administrative/custom folder'
      )
    })

    it('should remove trailing slash from path', () => {
      const konnector = {
        ...fixtures.konnector,
        folders: [{ defaultDir: 'custom folder/' }]
      }
      expect(buildFolderPath(konnector, fixtures.account)).toEqual(
        '/Administrative/custom folder'
      )
    })

    it('should not replace string containing variable name', () => {
      const konnector = {
        ...fixtures.konnector,
        folders: [{ defaultDir: '/$konnectorToNotReplace/custom' }]
      }
      expect(buildFolderPath(konnector, fixtures.account)).toEqual(
        '/Administrative/$konnectorToNotReplace/custom'
      )
    })

    it('should handle multiple slash in folder path', () => {
      const konnector = {
        ...fixtures.konnector,
        folders: [{ defaultDir: '///too//much///slashes/////' }]
      }
      expect(buildFolderPath(konnector, fixtures.account)).toEqual(
        '/Administrative/too/much/slashes'
      )
    })

    it('should handle multiple slash in folders values', () => {
      expect(
        buildFolderPath(fixtures.konnector, fixtures.account, {
          administrative: '///Administrative/////with//slashes////'
        })
      ).toEqual(
        '/Administrative/with/slashes/Test Konnector/5f344a5e53034124846dd0816909e27c'
      )
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

  describe('hasNewVersionAvailable', () => {
    it('should return true', () => {
      expect(hasNewVersionAvailable({ available_version: true })).toBe(true)
    })
    it('should return false', () => {
      expect(hasNewVersionAvailable({ available_version: false })).toBe(false)
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
      'TERMS_VERSION_MISMATCH',
      'USER_ACTION_NEEDED',
      'USER_ACTION_NEEDED.OAUTH_OUTDATED',
      'USER_ACTION_NEEDED.ACCOUNT_REMOVED',
      'USER_ACTION_NEEDED.CHANGE_PASSWORD',
      'USER_ACTION_NEEDED.PERMISSIONS_CHANGED',
      'USER_ACTION_NEEDED.SCA_REQUIRED',
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
            'USER_ACTION_NEEDED.PERMISSIONS_CHANGED',
            'USER_ACTION_NEEDED.SCA_REQUIRED'
          ].includes(message)
        )
        expect(error.isTermsVersionMismatchError()).toBe(
          message === 'TERMS_VERSION_MISMATCH'
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

describe('locales', () => {
  const error = new KonnectorJobError('DISK_QUOTA_EXCEEDED')
  const konn = { slug: 'boursorama83', name: 'Boursorama' }

  it('should work with getErrorLocale', () => {
    const t = jest.fn().mockImplementation(x => x)
    const desc = getErrorLocale(error, konn, t, 'description')
    expect(desc).toBe('error.job.DISK_QUOTA_EXCEEDED.description')
  })

  it('should work with getErrorLocale', () => {
    const desc = getErrorLocaleBound(error, konn, 'en', 'description')
    expect(desc).toBe(
      'This service cannot fetch your documents now. Please remove some files or go to **Settings > Storage** to get more free space.'
    )
  })
})
