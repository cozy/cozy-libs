import {
  getFeaturedPlaceholders,
  findPlaceholdersByQualification
} from './findPlaceholders'
import { mockPapersDefinitions } from '../../test/mockPaperDefinitions'

const fakeIspInvoiceFile = [
  {
    metadata: {
      qualification: {
        label: 'isp_invoice'
      }
    }
  }
]
const fakeQualificationItems = [
  {
    label: 'isp_invoice'
  }
]

describe('getPlaceholders', () => {
  describe('getFeaturedPlaceholders', () => {
    it('should return list of placeholders', () => {
      const featuredPlaceholders = getFeaturedPlaceholders(
        mockPapersDefinitions
      )

      expect(featuredPlaceholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'isp_invoice'
          })
        ]),
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tax_notice'
          })
        ]),
        expect.arrayContaining([
          expect.not.objectContaining({
            label: 'health_certificate'
          })
        ])
      )
      expect(featuredPlaceholders.length).toBe(2)
    })

    it('should return correct list of placeholders with file constraint', () => {
      const featuredPlaceholders = getFeaturedPlaceholders(
        mockPapersDefinitions,
        fakeIspInvoiceFile
      )

      expect(featuredPlaceholders).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({
            label: 'isp_invoice'
          })
        ])
      )
      expect(featuredPlaceholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'tax_notice'
          })
        ])
      )
    })
  })

  describe('findPlaceholdersByQualification', () => {
    it('should return an empty list', () => {
      const placeholders = findPlaceholdersByQualification(
        mockPapersDefinitions
      )

      expect(placeholders).toHaveLength(0)
    })

    it('should return correct list of placeholders with param', () => {
      const placeholders = findPlaceholdersByQualification(
        mockPapersDefinitions,
        fakeQualificationItems
      )

      expect(placeholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'isp_invoice'
          })
        ])
      )
    })
  })
})
