import {
  getFeaturedPlaceholders,
  findPlaceholdersByQualification,
  hasNoFileWithSameQualificationLabel,
  findPlaceholderByLabelAndCountry
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

describe('findPlaceholders', () => {
  describe('getFeaturedPlaceholders', () => {
    it('should return list of placeholders', () => {
      const featuredPlaceholders = getFeaturedPlaceholders({
        papersDefinitions: mockPapersDefinitions
      })

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
      const featuredPlaceholders = getFeaturedPlaceholders({
        papersDefinitions: mockPapersDefinitions,
        files: fakeIspInvoiceFile
      })

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

    describe('with theme selected', () => {
      it('should return list of placeholders', () => {
        const featuredPlaceholders = getFeaturedPlaceholders({
          papersDefinitions: mockPapersDefinitions,
          selectedThemes: [
            {
              items: [{ label: 'isp_invoice' }, { label: 'tax_notice' }]
            }
          ]
        })

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
        const featuredPlaceholders = getFeaturedPlaceholders({
          papersDefinitions: mockPapersDefinitions,
          files: fakeIspInvoiceFile,
          selectedThemes: [
            {
              items: [{ label: 'isp_invoice' }, { label: 'tax_notice' }]
            }
          ]
        })

        expect(featuredPlaceholders).toEqual(
          expect.arrayContaining([
            expect.not.objectContaining({
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
        expect(featuredPlaceholders.length).toBe(1)
      })

      it('should not return unsupported paper', () => {
        const featuredPlaceholders = getFeaturedPlaceholders({
          papersDefinitions: mockPapersDefinitions,
          files: fakeIspInvoiceFile,
          selectedThemes: [
            {
              items: [{ label: 'health_certificate' }]
            }
          ]
        })

        expect(featuredPlaceholders).toEqual(
          expect.not.arrayContaining([
            expect.objectContaining({
              label: 'health_certificate'
            })
          ])
        )
        expect(featuredPlaceholders.length).toBe(0)
      })
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
  describe('hasNoFileWithSameQualificationLabel', () => {
    it('should handle empty files', () => {
      const res = hasNoFileWithSameQualificationLabel(
        null,
        mockPapersDefinitions
      )

      expect(res).toBe(null)
    })
  })
  describe('findPlaceholderByLabelAndCountry', () => {
    it('should return an empty list', () => {
      const placeholders = findPlaceholderByLabelAndCountry(
        mockPapersDefinitions
      )

      expect(placeholders).toHaveLength(0)
    })
    it('should return correct paperDefinition with no country param & paperDefinition has no country', () => {
      const placeholders = findPlaceholderByLabelAndCountry(
        mockPapersDefinitions,
        'isp_invoice'
      )

      expect(placeholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'isp_invoice'
          })
        ])
      )
    })
    it('should return FR paperDefinition by default', () => {
      const placeholders = findPlaceholderByLabelAndCountry(
        mockPapersDefinitions,
        'driver_license'
      )

      expect(placeholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'driver_license',
            country: 'fr'
          })
        ])
      )
    })
    it('should return FR paperDefinition', () => {
      const placeholders = findPlaceholderByLabelAndCountry(
        mockPapersDefinitions,
        'driver_license',
        'fr'
      )

      expect(placeholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'driver_license',
            country: 'fr'
          })
        ])
      )
    })
    it('should return Stranger paperDefinition', () => {
      const placeholders = findPlaceholderByLabelAndCountry(
        mockPapersDefinitions,
        'driver_license',
        'foreign'
      )

      expect(placeholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'driver_license',
            country: 'foreign'
          })
        ])
      )
    })
    it("should return Stranger paperDefinition if country is defined but value doesn't exist", () => {
      const placeholders = findPlaceholderByLabelAndCountry(
        mockPapersDefinitions,
        'driver_license',
        'en'
      )

      expect(placeholders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: 'driver_license',
            country: 'foreign'
          })
        ])
      )
    })
  })
})
