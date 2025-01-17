import { makeTTL, revokePermissions, updatePermissions } from './helpers'

describe('ShareRestrictionModal/helpers', () => {
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

    it('should call updateDocumentPermissions with "undefined" date & password if their switches are true but the permission doesn\'t yet have these values', async () => {
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
        expiresAt: undefined,
        password: undefined,
        verbs: ['GET']
      })
    })

    it('should call updateDocumentPermissions with expected date & password if their switches are true', async () => {
      const updateDocumentPermissions = jest.fn()
      const file = { _id: '123' }

      await updatePermissions({
        file,
        t: jest.fn(),
        dateToggle: true,
        selectedDate: new Date('2100-01-01T00:00:00.000Z'),
        passwordToggle: true,
        password: '1234',
        editingRights: 'readOnly',
        documentType,
        updateDocumentPermissions,
        showAlert: jest.fn()
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, {
        expiresAt: '2100-01-01T00:00:00.000Z',
        password: '1234',
        verbs: ['GET']
      })
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
