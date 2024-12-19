import { isEditableAttribute, removeFilenameFromPath } from './helpers'

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
})
