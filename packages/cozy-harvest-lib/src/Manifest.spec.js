/* eslint-env jest */
import { Manifest } from './Manifest'

describe('Manifest', () => {
  describe('sanitize', () => {
    it('should remove "fields" if fields is null', () => {
      const manifest = {
        fields: null
      }
      const result = Manifest.sanitize(manifest)
      expect(result.fields).toBe(null)
    })

    it("shouldn't modify if fields is undefined", () => {
      const manifest = {}
      const result = Manifest.sanitize(manifest)
      expect(result.fields).toBe(undefined)
    })
  })

  describe('sanitizeIdentifier', () => {
    it('should not add any identifier', () => {
      const manifest = {
        fields: {
          passphrase: {
            required: true,
            type: 'password'
          }
        }
      }

      const result = Manifest.sanitize(manifest)
      expect(result.fields).toEqual(manifest.fields)
    })

    it('should set role=identifier for login', () => {
      const manifest = {
        fields: {
          login: { type: 'text' },
          password: { type: 'password' }
        }
      }
      const result = Manifest.sanitize(manifest)
      expect(result.fields.login.role).toBe('identifier')
    })

    it('should set first non-password field as role=identifier', () => {
      const manifest = {
        fields: {
          password: { type: 'password' },
          plop: { type: 'text' },
          foo: { type: 'date' }
        }
      }
      const result = Manifest.sanitize(manifest)
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
        const result = Manifest.sanitize(inputLegacy)
        expect(result.fields[name].role).toBe('identifier')
        expect(result.fields.plop.role).not.toBe('identifier')
      })
    }

    it('should set only one identifier', () => {
      const manifest = {
        fields: {
          identifier: { type: 'text' },
          mail: { type: 'email' },
          login: { type: 'text' },
          new_identifier: { type: 'text' }
        }
      }
      const result = Manifest.sanitize(manifest)
      const identifiers = Object.keys(result.fields).filter(
        name => result.fields[name].role === 'identifier'
      )
      expect(identifiers.length).toBe(1)
    })

    it('should set only one identifier even if there is many role=identifier in the manifest', () => {
      const manifest = {
        fields: {
          identifier: { type: 'text' },
          mail: { type: 'email', role: 'identifier' },
          login: { type: 'text', role: 'identifier' },
          new_identifier: { type: 'text', role: 'identifier' }
        }
      }
      const result = Manifest.sanitize(manifest)
      const identifiers = Object.keys(result.fields).filter(
        name => result.fields[name].role === 'identifier'
      )
      expect(identifiers.length).toBe(1)
    })

    it('should set only one identifier even if there is no password fields', () => {
      const manifest = {
        fields: {
          plop1: { type: 'text' },
          plop2: { type: 'text' },
          plop3: { type: 'text' },
          plop4: { type: 'text' }
        }
      }
      const result = Manifest.sanitize(manifest)
      const identifiers = Object.keys(result.fields).filter(
        name => result.fields[name].role === 'identifier'
      )
      expect(identifiers.length).toBe(1)
    })

    it('should keep the identifier priority', () => {
      const manifest = {
        fields: {
          identifier: { type: 'text' },
          mail: { type: 'email' },
          login: { type: 'text' },
          new_identifier: { type: 'text' }
        }
      }
      const result = Manifest.sanitize(manifest)
      expect(result.fields.login.required).toBe(true)
    })
  })

  describe('sanitizeRequired', () => {
    it('should set required=true as default value', () => {
      const manifest = {
        fields: {
          login: { type: 'text' },
          password: { type: 'password' },
          gender: { type: 'text', required: false },
          country: { type: 'text' }
        }
      }
      const result = Manifest.sanitize(manifest)
      expect(result.fields.login.required).toBe(true)
      expect(result.fields.password.required).toBe(true)
      expect(result.fields.gender.required).toBe(false)
      expect(result.fields.country.required).toBe(true)
    })
  })

  describe('sanitizeEncrypted', () => {
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
      let inputLegacy = {
        fields: {
          password: { type: 'password' },
          plop: { type: 'text' }
        }
      }
      inputLegacy.fields[name] = { type: 'text' }
      it('should set encrypted=true to ' + name, () => {
        const result = Manifest.sanitize(inputLegacy)
        expect(result.fields[name].encrypted).toBe(true)
      })
    }
  })
})
