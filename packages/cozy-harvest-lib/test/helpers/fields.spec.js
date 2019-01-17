/* eslint-env jest */
import {
  getEncryptedFieldName,
  getFieldPlaceholder,
  sanitizeSelectProps
} from 'helpers/fields'

describe('Fields Helper', () => {
  describe('getEncryptedFieldName', () => {
    it('should return encrypted password property', () => {
      expect(getEncryptedFieldName('password')).toBe('credentials_encrypted')
    })

    it('should return encrypted field property', () => {
      expect(getEncryptedFieldName('foo')).toBe('foo_encrypted')
    })
  })

  describe('getFieldPlaceholder', () => {
    it('shoud return empty string', () => {
      expect(
        getFieldPlaceholder({
          name: 'password',
          encrypted: true
        })
      ).toBe('Fallback placeholder')
    })

    it('shoud return fallback value', () => {
      expect(
        getFieldPlaceholder(
          {
            name: 'password',
            encrypted: true
          },
          'Fallback placeholder'
        )
      ).toBe('Fallback placeholder')
    })

    it('shoud return prop `placeholder`', () => {
      expect(
        getFieldPlaceholder(
          {
            name: 'password',
            encrypted: true,
            placeholder: 'Random placeholder'
          },
          'Fallback placeholder'
        )
      ).toBe('Random placeholder')
    })

    it('should return placeholder for encrypted fields', () => {
      expect(
        getFieldPlaceholder(
          {
            encrypted: true,
            initialValue: 'ezfZEZE435345DSFfd',
            placeholder: 'Random placeholder'
          },
          'Fallback placeholder'
        )
      ).toBe('*************')
    })
  })

  describe('sanitizeSelectProps', () => {
    it('should sanitize legacy options', () => {
      const fieldWithLegacyOptions = {
        options: [
          { name: 'Option 1', value: '1' },
          { name: 'Option 2', value: '2' },
          { name: 'Option 3', value: '3' }
        ],
        type: 'select'
      }
      expect(sanitizeSelectProps(fieldWithLegacyOptions)).toEqual({
        options: [
          { name: 'Option 1', value: '1', label: 'Option 1' },
          { name: 'Option 2', value: '2', label: 'Option 2' },
          { name: 'Option 3', value: '3', label: 'Option 3' }
        ],
        type: 'select'
      })
    })

    it('should keep labels with legacy options', () => {
      const fieldWithLegacyOptions = {
        options: [
          { label: 'Label 1', name: 'Option 1', value: '1' },
          { label: 'Label 2', name: 'Option 2', value: '2' },
          { label: 'Label 3', name: 'Option 3', value: '3' }
        ],
        type: 'select'
      }
      expect(sanitizeSelectProps(fieldWithLegacyOptions)).toEqual({
        options: [
          { name: 'Option 1', value: '1', label: 'Label 1' },
          { name: 'Option 2', value: '2', label: 'Label 2' },
          { name: 'Option 3', value: '3', label: 'Label 3' }
        ],
        type: 'select'
      })
    })

    it('should map existing value to option', () => {
      const field = {
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' }
        ],
        value: '2'
      }

      expect(sanitizeSelectProps(field).value).toEqual({
        label: 'Option 2',
        value: '2'
      })
    })

    it('should not allow empty string for value', () => {
      const field = {
        value: ''
      }
      expect(sanitizeSelectProps(field).value).toBeUndefined()
    })

    it('should set type to select', () => {
      const field = {
        type: 'dropdown'
      }
      expect(sanitizeSelectProps(field).type).toBe('select')
    })
  })
})
