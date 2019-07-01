import { getCompletedDocumentsCount } from './documentsDataSlice'

describe('documentsDataSlice', () => {
  describe('getCompletedDocumentsCount', () => {
    it('should return the number of completed documents', () => {
      const state = {
        documents: {
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
      const result = getCompletedDocumentsCount(state)
      expect(result).toEqual(3)
    })
  })
})
