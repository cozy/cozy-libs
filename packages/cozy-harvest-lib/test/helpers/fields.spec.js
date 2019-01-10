/* eslint-env jest */
import { sanitizeSelectProps } from 'helpers/fields'

describe('Fields Helper', () => {
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
