import { shouldBeForwardButton } from './helpers'

describe('shouldBeForwardButton', () => {
  describe('Mobile web', () => {
    it('should be false if the mobile web application is "Drive"', () => {
      global.navigator.share = () => {}
      const mockClient = { appMetadata: { slug: 'drive' } }

      expect(shouldBeForwardButton(mockClient)).toBe(false)
    })
    it('should be true if the mobile web application is not "Drive"', () => {
      global.navigator.share = () => {}
      const mockClient = { appMetadata: { slug: 'other' } }

      expect(shouldBeForwardButton(mockClient)).toBe(true)
    })
  })

  describe('Desktop', () => {
    it('should be false if the desktop application is "Drive"', () => {
      global.navigator.share = null
      const mockClient = { appMetadata: { slug: 'drive' } }

      expect(shouldBeForwardButton(mockClient)).toBe(false)
    })
    it('should be false if the desktop application is not "Drive"', () => {
      global.navigator.share = null
      const mockClient = { appMetadata: { slug: 'other' } }

      expect(shouldBeForwardButton(mockClient)).toBe(false)
    })
  })
})
