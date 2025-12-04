import flag from 'cozy-flags'

import {
  isEditableAttribute,
  removeFilenameFromPath,
  isFileSummaryCompatible
} from './helpers'

jest.mock('cozy-flags')

// Default mock for drive.summary flag
flag.mockImplementation(flagName => {
  if (flagName === 'drive.summary') {
    return JSON.stringify({
      types: ['application/pdf', 'text/*'],
      pageLimit: 50,
      maxTokens: 100000
    })
  }
  return null
})

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

    it('should return false if flag is not set', () => {
      flag.mockReturnValue(null)
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should return false if flag JSON is invalid', () => {
      flag.mockReturnValue('invalid json')
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should return false if flag config is missing types array', () => {
      flag.mockReturnValue(JSON.stringify({}))
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should return false if types array is empty', () => {
      flag.mockReturnValue(JSON.stringify({ types: [] }))
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should return false if types is not an array', () => {
      flag.mockReturnValue(JSON.stringify({ types: 'application/pdf' }))
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should return true if mime matches exactly', () => {
      flag.mockReturnValue(
        JSON.stringify({ types: ['application/pdf', 'text/plain'] })
      )
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'text/plain' })).toBe(true)
    })

    it('should handle case-insensitive mime matching', () => {
      flag.mockReturnValue(
        JSON.stringify({ types: ['application/PDF', 'TEXT/plain'] })
      )
      expect(isFileSummaryCompatible({ mime: 'APPLICATION/pdf' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'text/PLAIN' })).toBe(true)
    })

    it('should return false if mime does not match', () => {
      flag.mockReturnValue(JSON.stringify({ types: ['application/pdf'] }))
      expect(isFileSummaryCompatible({ mime: 'text/plain' })).toBe(false)
    })

    it('should handle wildcard types', () => {
      flag.mockReturnValue(JSON.stringify({ types: ['text/*'] }))
      expect(isFileSummaryCompatible({ mime: 'text/plain' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'text/markdown' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(false)
    })

    it('should handle case-insensitive wildcard matching', () => {
      flag.mockReturnValue(JSON.stringify({ types: ['TEXT/*'] }))
      expect(isFileSummaryCompatible({ mime: 'text/plain' })).toBe(true)
      expect(isFileSummaryCompatible({ mime: 'TEXT/markdown' })).toBe(true)
    })

    it('should respect page limit when pageCount is provided', () => {
      flag.mockReturnValue(
        JSON.stringify({ types: ['application/pdf'], pageLimit: 50 })
      )
      expect(
        isFileSummaryCompatible({ mime: 'application/pdf' }, { pageCount: 10 })
      ).toBe(true)
      expect(
        isFileSummaryCompatible({ mime: 'application/pdf' }, { pageCount: 50 })
      ).toBe(true)
      expect(
        isFileSummaryCompatible({ mime: 'application/pdf' }, { pageCount: 51 })
      ).toBe(false)
    })

    it('should return false if pageCount is 0 or negative', () => {
      flag.mockReturnValue(
        JSON.stringify({ types: ['application/pdf'], pageLimit: 50 })
      )
      expect(
        isFileSummaryCompatible({ mime: 'application/pdf' }, { pageCount: 0 })
      ).toBe(false)
      expect(
        isFileSummaryCompatible({ mime: 'application/pdf' }, { pageCount: -1 })
      ).toBe(false)
    })

    it('should return true if pageCount is not provided and no pageLimit is set', () => {
      flag.mockReturnValue(JSON.stringify({ types: ['application/pdf'] }))
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(true)
    })

    it('should return true if pageCount is not provided but pageLimit is set', () => {
      flag.mockReturnValue(
        JSON.stringify({ types: ['application/pdf'], pageLimit: 50 })
      )
      expect(isFileSummaryCompatible({ mime: 'application/pdf' })).toBe(true)
    })
  })
})
