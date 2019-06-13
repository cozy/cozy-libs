import { handleOAuthResponse } from 'helpers/oauth'

describe('Oauth helper', () => {
  describe('handleOAuthResponse', () => {
    let originalLocation
    let originalOpener

    beforeEach(() => {
      originalLocation = window.location
      originalOpener = window.opener

      // As seen at https://gist.github.com/remarkablemark/5cb571a13a6635ab89cf2bb47dc004a3#gistcomment-2905726
      delete window.location
      window.location = {
        search:
          'account=bc2aca6566cf4a72afe6c615aa1e3d31&state=70720eb0-6204-484d'
      }
      window.opener = {
        postMessage: jest.fn()
      }
    })

    afterEach(() => {
      window.location = originalLocation
      window.opener = originalOpener
    })

    it('should send message with query string data', () => {
      const expectedOAuthData = {
        key: 'bc2aca6566cf4a72afe6c615aa1e3d31',
        oAuthStateKey: '70720eb0-6204-484d'
      }

      handleOAuthResponse()
      expect(window.opener.postMessage).toHaveBeenCalledWith(
        expectedOAuthData,
        '*'
      )
    })

    it('should return true', () => {
      const result = handleOAuthResponse()
      expect(result).toBe(true)
    })

    it('should return false when no account is present in query string', () => {
      window.location = {
        search: 'state=70720eb0-6204-484d'
      }

      const result = handleOAuthResponse()
      expect(result).toBe(false)
    })

    it('should return false when no state is present in query string', () => {
      window.location = {
        search: 'account=bc2aca6566cf4a72afe6c615aa1e3d31'
      }

      const result = handleOAuthResponse()
      expect(result).toBe(false)
    })
  })
})
