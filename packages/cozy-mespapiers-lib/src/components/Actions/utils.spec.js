import { makeActions, makeActionVariant } from './utils'
import { download } from './Items/download'
import { forward } from './Items/forward'

jest.mock('./Items/download')
jest.mock('./Items/forward')

describe('Actions utils', () => {
  describe('makeActions', () => {
    it('should have empty actions array', () => {
      const actions = makeActions()

      expect(actions).toStrictEqual([])
    })

    it('should have object with key named with name property of the object returned by the function and value is the full object returned by the function', () => {
      const mockFuncActionWithName = jest.fn(() => ({
        name: 'mockFuncActionWithName name'
      }))

      const actions = makeActions([mockFuncActionWithName])

      expect(actions).toStrictEqual([
        {
          'mockFuncActionWithName name': {
            name: 'mockFuncActionWithName name'
          }
        }
      ])
    })

    it('should have object with key named with name of function passed and value is the full object returned by the function', () => {
      const mockFuncActionWithoutName = jest.fn(() => ({
        propA: 0,
        propB: 1
      }))

      const actions = makeActions([mockFuncActionWithoutName])

      expect(actions).toStrictEqual([
        { mockConstructor: { propA: 0, propB: 1 } }
      ])
    })
  })

  describe('makeActionVariant', () => {
    it('should have "download" action on desktop', () => {
      global.navigator.share = null

      expect(makeActionVariant()).toStrictEqual([download])
    })

    it('should have "download" & "Forward" action (in this order) on mobile', () => {
      global.navigator.share = () => {}

      expect(makeActionVariant()).toStrictEqual([forward, download])
    })
  })
})
