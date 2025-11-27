import flag from 'cozy-flags'

import {
  isEditableAttribute,
  removeFilenameFromPath,
  isFileSummaryCompatible
} from './helpers'

jest.mock('cozy-flags')

describe('helpers', () => {
  describe('isEditableAttribute', () => {
    const makeFile = ({ fromConnector } = {}) => ({
      _id: '00',
      name: 'file',
      cozyMetadata: fromConnector ? { sourceAccount: '123' } : {}
    })

    describe('file provided by a Connector', () => {
      it('"issueDate" should not be a editable attribute', () => {
        const issueDate = isEditableAttribute(
          'issueDate',
          makeFile({ fromConnector: true })
        )
        expect(issueDate).toBe(false)
      })

      it('"number" should be an editable attribute', () => {
        const number = isEditableAttribute(
          'number',
          makeFile({ fromConnector: true })
        )
        expect(number).toBe(true)
      })

      it('"datetime" should not be an editable attribute', () => {
        const datetime = isEditableAttribute('datetime', makeFile())
        expect(datetime).toBe(false)
      })

      it('"qualification" should not be an editable attribute', () => {
        const qualification = isEditableAttribute('qualification', makeFile())
        expect(qualification).toBe(false)
      })
    })

    describe('file NOT provided by a Connector', () => {
      it('"issueDate" should not be a editable attribute', () => {
        const issueDate = isEditableAttribute('issueDate', makeFile())
        expect(issueDate).toBe(true)
      })

      it('"number" should be a editable attribute', () => {
        const number = isEditableAttribute('number', makeFile())
        expect(number).toBe(true)
      })

      it('"datetime" should not be an editable attribute', () => {
        const datetime = isEditableAttribute('datetime', makeFile())
        expect(datetime).toBe(false)
      })

      it('"qualification" should not be an editable attribute', () => {
        const qualification = isEditableAttribute('qualification', makeFile())
        expect(qualification).toBe(false)
      })
    })
  })

  describe('removeFilenameFromPath', () => {
    it('should handle all types of path', () => {
      expect(removeFilenameFromPath('/folder/7IsD.gif', '7IsD.gif')).toBe(
        '/folder'
      )

      expect(removeFilenameFromPath('/7IsD.gif', '7IsD.gif')).toBe('/')

      expect(removeFilenameFromPath('//7IsD.gif', '7IsD.gif')).toBe('/')

      expect(removeFilenameFromPath('/7IsD.gif/7IsD.gif', '7IsD.gif')).toBe(
        '/7IsD.gif'
      )
    })
  })

  describe('isFileSummaryCompatible', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should return false if file is not defined or has no mime', () => {
      expect(isFileSummaryCompatible(null)).toBe(false)
      expect(isFileSummaryCompatible({})).toBe(false)
    })

    it('should return false if no compatible types are defined', () => {
      flag.mockReturnValue(JSON.stringify([]))
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should return true if mime matches exactly', () => {
      flag.mockReturnValue(
        JSON.stringify([{ type: 'application/pdf' }, { type: 'text/plain' }])
      )
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'text/plain' })).toBe(true)
    })

    it('should return false if mime does not match', () => {
      flag.mockReturnValue(JSON.stringify([{ type: 'application/pdf' }]))
      expect(isFileSummaryCompatible({ mime: 'text/plain' })).toBe(false)
    })

    it('should handle wildcard types', () => {
      flag.mockReturnValue(JSON.stringify([{ type: 'text/*' }]))
      expect(isFileSummaryCompatible({ mime: 'text/plain' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'text/markdown' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should respect page limit options for PDFs', () => {
      flag.mockReturnValue(
        JSON.stringify([
          { type: 'application/pdf', options: { pageLimit: 50 } }
        ])
      )
      expect(
        isFileSummaryCompatible(
          { mime: 'application/pdf' },
          { pdfPageCount: 10 }
        )
      ).toBe(true)
      expect(
        isFileSummaryCompatible(
          { mime: 'application/pdf' },
          { pdfPageCount: 50 }
        )
      ).toBe(true)
      expect(
        isFileSummaryCompatible(
          { mime: 'application/pdf' },
          { pdfPageCount: 51 }
        )
      ).toBe(false)
    })

    it('should return false if pdfPageCount is missing when required', () => {
      flag.mockReturnValue(
        JSON.stringify([
          { type: 'application/pdf', options: { pageLimit: 50 } }
        ])
      )
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })
  })
})
