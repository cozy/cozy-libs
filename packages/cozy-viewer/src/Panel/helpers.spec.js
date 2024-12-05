import { makeHideDivider } from './helpers'

describe('makeHideDivider', () => {
  describe('should hide the divider', () => {
    it('if contact is the only qualification', () => {
      const res = makeHideDivider([{ name: 'contact' }], 0)

      expect(res).toBeTruthy()
    })

    it('for the last qualification', () => {
      const res = makeHideDivider(
        [{ name: 'contact' }, { name: 'issueDate' }],
        1
      )

      expect(res).toBeTruthy()
    })

    it('for the first qualificaiton if contact is the second and last one', () => {
      const res = makeHideDivider(
        [{ name: 'issueDate' }, { name: 'contact' }],
        0
      )

      expect(res).toBeTruthy()
    })
  })

  describe('should show the divider', () => {
    it('for contact if is the first and not only one qualification', () => {
      const res = makeHideDivider(
        [{ name: 'contact' }, { name: 'issueDate' }],
        0
      )

      expect(res).toBeFalsy()
    })
  })
})
