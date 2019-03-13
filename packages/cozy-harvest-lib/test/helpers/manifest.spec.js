/* eslint-env jest */
import manifest from 'helpers/manifest'

describe('manifest', () => {
  describe('defaultFieldsValues', () => {
    it('shoud return default values', () => {
      const fields = {
        username: {
          type: 'text'
        },
        age: {
          default: '18',
          type: 'text'
        }
      }

      expect(manifest.defaultFieldsValues(fields)).toEqual({
        age: '18'
      })
    })
  })

  describe('getIdentifier', () => {
    it('should return field having role=identifier', () => {
      const fields = {
        username: {
          type: 'text'
        },
        id: {
          type: 'text',
          role: 'identifier'
        }
      }
      expect(manifest.getIdentifier(fields)).toBe('id')
    })

    it('should return the first field', () => {
      const fields = {
        username: {
          type: 'text'
        },
        id: {
          type: 'text'
        }
      }

      expect(manifest.getIdentifier(fields)).toBe('username')
    })
  })

  describe('sanitize', () => {
    it('should remove "fields" if fields is null', () => {
      const current = {
        fields: null
      }
      const result = manifest.sanitize(current)
      expect(result.fields).toBe(null)
    })

    it("shouldn't modify if fields is undefined", () => {
      const current = {}
      const result = manifest.sanitize(current)
      expect(result.fields).toBe(undefined)
    })

    it('should return empty manifest', () => {
      expect(manifest.sanitize()).toEqual({})
    })

    it('should not mutate source manifest', () => {
      const current = {
        fields: {
          username: {
            type: 'text',
            required: {
              value: 'true'
            }
          },
          passphrase: {
            type: 'password'
          },
          birthdate: {
            type: 'date'
          }
        }
      }

      manifest.sanitize(current)
      expect(current).toEqual({
        fields: {
          username: {
            type: 'text',
            required: {
              value: 'true'
            }
          },
          passphrase: {
            type: 'password'
          },
          birthdate: {
            type: 'date'
          }
        }
      })
    })
  })

  describe('sanitizeFields', () => {
    it('should remove old property advancedFields', () => {
      const oldManifest = {
        fields: {
          login: {
            type: 'text'
          },
          password: {
            type: 'password'
          },
          advancedFields: {
            folderPath: {
              advanced: true,
              isRequired: false
            }
          }
        }
      }

      const result = manifest.sanitize(oldManifest)
      expect(result.fields.advancedFields).toBeUndefined()
    })
  })

  describe('sanitizeIdentifier', () => {
    it('should not add any identifier', () => {
      const current = {
        fields: {
          passphrase: {
            required: true,
            type: 'password'
          }
        }
      }

      const result = manifest.sanitize(current)
      expect(result.fields.passphrase.role).not.toBe('identifier')
      expect(Object.keys(result.fields).length).toBe(1)
    })

    it('should set role=identifier for login', () => {
      const current = {
        fields: {
          login: { type: 'text' },
          password: { type: 'password' }
        }
      }
      const result = manifest.sanitize(current)
      expect(result.fields.login.role).toBe('identifier')
    })

    it('should set first non-password field as role=identifier', () => {
      const current = {
        fields: {
          password: { type: 'password' },
          plop: { type: 'text' },
          foo: { type: 'date' }
        }
      }
      const result = manifest.sanitize(current)
      expect(result.fields.plop.role).toBe('identifier')
      expect(result.fields.foo.role).not.toBe('identifier')
    })

    const legacyLoginFieldsTest = [
      'login',
      'identifier',
      'new_identifier',
      'email'
    ]
    for (let name of legacyLoginFieldsTest) {
      let inputLegacy = {
        fields: {
          password: { type: 'password' },
          plop: { type: 'text' }
        }
      }
      inputLegacy.fields[name] = { type: 'text' }
      it('should set role=identifier to ' + name, () => {
        const result = manifest.sanitize(inputLegacy)
        expect(result.fields[name].role).toBe('identifier')
        expect(result.fields.plop.role).not.toBe('identifier')
      })
    }

    it('should set only one identifier', () => {
      const current = {
        fields: {
          identifier: { type: 'text' },
          mail: { type: 'email' },
          login: { type: 'text' },
          new_identifier: { type: 'text' }
        }
      }
      const result = manifest.sanitize(current)
      const identifiers = Object.keys(result.fields).filter(
        name => result.fields[name].role === 'identifier'
      )
      expect(identifiers.length).toBe(1)
    })

    it('should set only one identifier even if there is many role=identifier in the manifest', () => {
      const current = {
        fields: {
          identifier: { type: 'text' },
          mail: { type: 'email', role: 'identifier' },
          login: { type: 'text', role: 'identifier' },
          new_identifier: { type: 'text', role: 'identifier' }
        }
      }
      const result = manifest.sanitize(current)
      const identifiers = Object.keys(result.fields).filter(
        name => result.fields[name].role === 'identifier'
      )
      expect(identifiers.length).toBe(1)
    })

    it('should set only one identifier even if there is no password fields', () => {
      const current = {
        fields: {
          plop1: { type: 'text' },
          plop2: { type: 'text' },
          plop3: { type: 'text' },
          plop4: { type: 'text' }
        }
      }
      const result = manifest.sanitize(current)
      const identifiers = Object.keys(result.fields).filter(
        name => result.fields[name].role === 'identifier'
      )
      expect(identifiers.length).toBe(1)
    })

    it('should keep the identifier priority', () => {
      const current = {
        fields: {
          identifier: { type: 'text' },
          mail: { type: 'email' },
          login: { type: 'text' },
          new_identifier: { type: 'text' }
        }
      }
      const result = manifest.sanitize(current)
      expect(result.fields.login.required).toBe(true)
    })
  })

  describe('sanitizeRequired', () => {
    it('should set required=true as default value', () => {
      const current = {
        fields: {
          login: { type: 'text' },
          password: { type: 'password' },
          gender: { type: 'text', required: false },
          country: { type: 'text' }
        }
      }
      const result = manifest.sanitize(current)
      expect(result.fields.login.required).toBe(true)
      expect(result.fields.password.required).toBe(true)
      expect(result.fields.gender.required).toBe(false)
      expect(result.fields.country.required).toBe(true)
    })

    it('should handle legacy property isRequired', () => {
      const current = {
        fields: {
          login: { type: 'text' },
          password: { type: 'password' },
          gender: { type: 'text', isRequired: false },
          country: { type: 'text' }
        }
      }
      const result = manifest.sanitize(current)
      expect(result.fields.login.required).toBe(true)
      expect(result.fields.password.required).toBe(true)
      expect(result.fields.gender.required).toBe(false)
      expect(result.fields.country.required).toBe(true)
    })
  })

  describe('sanitizeEncrypted', () => {
    it('should et encrypted for type=password', () => {
      const current = {
        fields: {
          username: { type: 'text' },
          passphrase: { type: 'password' }
        }
      }

      const result = manifest.sanitize(current)
      expect(result.fields.passphrase.encrypted).toBe(true)
    })

    const legacyEncryptedFieldsTest = [
      'secret',
      'dob',
      'code',
      'answer',
      'access_token',
      'refresh_token',
      'appSecret'
    ]

    for (let name of legacyEncryptedFieldsTest) {
      let legacyManifest = {
        fields: {
          [name]: { type: 'text' },
          password: { type: 'password' },
          plop: { type: 'text' }
        }
      }

      it('should set encrypted=true to ' + name, () => {
        const result = manifest.sanitize(legacyManifest)
        expect(result.fields[name].encrypted).toBe(true)
      })

      it('should keep encrypted value', () => {
        const current = {
          fields: {
            [name]: { type: 'text', encrypted: false },
            passphrase: { type: 'password', encrypted: true }
          }
        }
        const result = manifest.sanitize(current)
        expect(result.fields[name].encrypted).toBe(false)
        expect(result.fields.passphrase.encrypted).toBe(true)
      })
    }
  })
})
