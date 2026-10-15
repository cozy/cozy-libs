import { endOfDay } from 'date-fns'

import {
  makeTTL,
  revokePermissions,
  toExpirationDate,
  updatePermissions
} from './helpers'

describe('ShareRestrictionModal/helpers', () => {
  describe('toExpirationDate', () => {
    it('returns falsy values unchanged', () => {
      expect(toExpirationDate(null)).toBeNull()
      expect(toExpirationDate(undefined)).toBeUndefined()
      expect(toExpirationDate('')).toBe('')
    })
    it('normalizes a Date to the end of its day', () => {
      const date = new Date(2100, 0, 1, 9, 30)
      expect(toExpirationDate(date)).toEqual(endOfDay(date))
    })
    it('accepts an ISO string', () => {
      const iso = '2100-01-01T09:30:00.000Z'
      expect(toExpirationDate(iso)).toEqual(endOfDay(new Date(iso)))
    })
  })

  describe('makeTTL', () => {
    it('sould return undefined', () => {
      expect(makeTTL()).toBeUndefined()
      expect(makeTTL(123)).toBeUndefined()
      expect(makeTTL('abc')).toBeUndefined()
      expect(makeTTL(new Date('2023-01-01T00:00:00.000Z'))).toBeUndefined()
      expect(makeTTL(new Date('abc'))).toBeUndefined()
      expect(makeTTL('2023-01-01T00:00:00.000Z')).toBeUndefined()
    })
    it('sould return TTL in seconds', () => {
      expect(makeTTL(new Date('2100-01-01T00:00:00.000Z'))).toBeDefined()
      expect(makeTTL('2100-01-01T00:00:00.000Z')).toBeDefined()
    })
    it('keeps a link picked for today valid until the end of the day', () => {
      // Regression: picking "today" used to resolve to midnight (already past),
      // which dropped the TTL and the link never expired or was unreachable.
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2100-01-01T12:00:00.000Z'))
      try {
        expect(makeTTL(new Date())).toBeDefined()
      } finally {
        jest.useRealTimers()
      }
    })
  })

  describe('updatePermissions', () => {
    const documentType = 'Files'
    it('should call updateDocumentPermissions with "readOnly" permission', async () => {
      const updateDocumentPermissions = jest.fn()
      const file = { _id: '123' }

      await updatePermissions({
        file,
        t: jest.fn(),
        dateToggle: false,
        selectedDate: null,
        passwordToggle: false,
        password: '',
        editingRights: 'readOnly',
        documentType,
        updateDocumentPermissions,
        showAlert: jest.fn()
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, {
        expiresAt: '',
        password: '',
        verbs: ['GET']
      })
    })

    it('should call updateDocumentPermissions with "write" permissions', async () => {
      const updateDocumentPermissions = jest.fn()
      const file = { _id: '123' }

      await updatePermissions({
        file,
        t: jest.fn(),
        dateToggle: false,
        selectedDate: null,
        passwordToggle: false,
        password: '',
        editingRights: 'write',
        documentType,
        updateDocumentPermissions,
        showAlert: jest.fn()
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, {
        expiresAt: '',
        password: '',
        verbs: ['GET', 'POST', 'PUT', 'PATCH']
      })
    })

    it('should call updateDocumentPermissions with empty date & password if their switches are false', async () => {
      const updateDocumentPermissions = jest.fn()
      const file = { _id: '123' }

      await updatePermissions({
        file,
        t: jest.fn(),
        dateToggle: false,
        selectedDate: null,
        passwordToggle: false,
        password: '',
        editingRights: 'readOnly',
        documentType,
        updateDocumentPermissions,
        showAlert: jest.fn()
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, {
        expiresAt: '',
        password: '',
        verbs: ['GET']
      })
    })

    it('should call updateDocumentPermissions with an empty date and keep the password if enabled without values', async () => {
      const updateDocumentPermissions = jest.fn()
      const file = { _id: '123' }

      await updatePermissions({
        file,
        t: jest.fn(),
        dateToggle: true,
        selectedDate: null,
        passwordToggle: true,
        password: '',
        editingRights: 'readOnly',
        documentType,
        updateDocumentPermissions,
        showAlert: jest.fn()
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, {
        expiresAt: '',
        password: undefined,
        verbs: ['GET']
      })
    })

    it('should call updateDocumentPermissions with expected date & password if their switches are true', async () => {
      const updateDocumentPermissions = jest.fn()
      const file = { _id: '123' }

      const selectedDate = new Date('2100-01-01T00:00:00.000Z')
      await updatePermissions({
        file,
        t: jest.fn(),
        dateToggle: true,
        selectedDate,
        passwordToggle: true,
        password: '1234',
        editingRights: 'readOnly',
        documentType,
        updateDocumentPermissions,
        showAlert: jest.fn()
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, {
        expiresAt: endOfDay(selectedDate).toISOString(),
        password: '1234',
        verbs: ['GET']
      })
    })

    it('sets expiration to the end of the selected day so picking today stays valid', async () => {
      // Freeze time so the "expires in the future" assertion can't flake near
      // midnight or under slow CI.
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2100-01-01T12:00:00.000Z'))
      try {
        const updateDocumentPermissions = jest.fn()
        const file = { _id: '123' }
        const today = new Date()

        await updatePermissions({
          file,
          t: jest.fn(),
          dateToggle: true,
          selectedDate: today,
          passwordToggle: false,
          password: '',
          editingRights: 'readOnly',
          documentType,
          updateDocumentPermissions,
          showAlert: jest.fn()
        })

        const { expiresAt } = updateDocumentPermissions.mock.calls[0][1]
        expect(expiresAt).toBe(endOfDay(today).toISOString())
        expect(new Date(expiresAt).getTime()).toBeGreaterThan(Date.now())
      } finally {
        jest.useRealTimers()
      }
    })
  })

  describe('revokePermissions', () => {
    const documentType = 'Files'
    it('should call revokeSharingLink', async () => {
      const revokeSharingLink = jest.fn()
      const file = { _id: '123' }

      await revokePermissions({
        file,
        t: jest.fn(),
        documentType,
        revokeSharingLink,
        showAlert: jest.fn()
      })

      expect(revokeSharingLink).toHaveBeenCalledWith(file)
    })
  })
})
