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
      const editingRights = 'readOnly'

      await updatePermissions({
        file,
        t: jest.fn(),
        editingRights,
        documentType,
        updateDocumentPermissions
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, ['GET'])
    })

    it('should call updateDocumentPermissions with "write" permissions', async () => {
      const updateDocumentPermissions = jest.fn()
      const file = { _id: '123' }
      const editingRights = 'write'

      await updatePermissions({
        file,
        t: jest.fn(),
        editingRights,
        documentType,
        updateDocumentPermissions
      })

      expect(updateDocumentPermissions).toHaveBeenCalledWith(file, [
        'GET',
        'POST',
        'PUT',
        'PATCH'
      ])
    })
  })

  describe('revokePermissions', () => {
    const documentType = 'Files'
    it('should call revokeSharingLink', async () => {
      const revokeSharingLink = jest.fn()
      const file = { _id: '123' }
      const editingRights = 'revoke'

      await revokePermissions({
        file,
        t: jest.fn(),
        editingRights,
        documentType,
        revokeSharingLink
      })

      expect(revokeSharingLink).toHaveBeenCalledWith(file)
    })
  })
})
