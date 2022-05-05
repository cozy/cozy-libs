import {
  getFeaturedPlaceholders,
  findPlaceholdersByQualification,
  hasNoFileWithSameQualificationLabel
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
          selectedTheme: {
            items: [{ label: 'isp_invoice' }, { label: 'tax_notice' }]
          }
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
          selectedTheme: {
            items: [{ label: 'isp_invoice' }, { label: 'tax_notice' }]
          }
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
          selectedTheme: {
            items: [{ label: 'health_certificate' }]
          }
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
})

describe('hasNoFileWithSameQualificationLabel', () => {
  it('should handle empty files', () => {
    const res = hasNoFileWithSameQualificationLabel(null, mockPapersDefinitions)

    expect(res).toBe(null)
  })
})
