import { download } from './Items/download'
import { forward } from './Items/forward'
import { makeActionVariant } from './utils'

jest.mock('./Items/download')
jest.mock('./Items/forward')
jest.mock('copy-text-to-clipboard', () => ({ copy: jest.fn() }))

describe('Actions utils', () => {
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
