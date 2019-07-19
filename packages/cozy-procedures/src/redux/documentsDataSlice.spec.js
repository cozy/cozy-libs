import {
  getCompletedFromDrive,
  getCompletedDocumentsCount,
  getDocumentsTotal
} from './documentsDataSlice'

describe('documentsDataSlice', () => {
  const state = {
    documents: {
      completedFromDrive: 2,
      data: {
        address_certificate: {
          files: [
            {
              id: 'baac72edf28acadd',
              name: 'facture_edf.pdf',
              trashed: false
            },
            {
              id: '94bbda9a86b52c76',
              name: 'facture_fibre.pdf',
              trashed: false
            }
          ]
        },
        bank_identity: { files: [] },
        identity_document: {
          files: [
            {
              id: '979469aa60434433',
              name: 'carte_identite.png',
              trashed: false
            }
          ]
        }
      }
    }
  }

  describe('getCompletedDocumentsCount', () => {
    it('should return the number of documents that have been completed from drive', () => {
      const result = getCompletedFromDrive(state)
      expect(result).toEqual(2)
    })
  })

  describe('getCompletedDocumentsCount', () => {
    it('should return the number of completed documents', () => {
      const result = getCompletedDocumentsCount(state)
      expect(result).toEqual(3)
    })
  })

  describe('getDocumentsTotal', () => {
    it('should return the number of expected documents', () => {
      const result = getDocumentsTotal(state)
      expect(result).toEqual(5)
    })
  })
})
