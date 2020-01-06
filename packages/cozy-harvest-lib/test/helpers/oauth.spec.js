import { handleOAuthResponse, getOAuthUrl } from 'helpers/oauth'

describe('Oauth helper', () => {
  describe('getOAuthUrl', () => {
    const defaultConf = {
      cozyUrl: 'https://cozyurl',
      accountType: 'testslug',
      oAuthStateKey: 'statekey',
      nonce: '1234'
    }
    it('should work with all params', () => {
      const url = getOAuthUrl({
        ...defaultConf,
        oAuthConf: { scope: ['myscope'] }
      })
      expect(url).toEqual(
        'https://cozyurl/accounts/testslug/start?state=statekey&nonce=1234&scope=myscope'
      )
    })
    it('should remove scope if scope value is undefined or null or false', () => {
      let url = getOAuthUrl({ ...defaultConf, oAuthConf: {} })
      expect(url).toEqual(
        'https://cozyurl/accounts/testslug/start?state=statekey&nonce=1234'
      )
      url = getOAuthUrl({ ...defaultConf, oAuthConf: { scope: false } })
      expect(url).toEqual(
        'https://cozyurl/accounts/testslug/start?state=statekey&nonce=1234'
      )
      url = getOAuthUrl({ ...defaultConf, oAuthConf: { scope: null } })
      expect(url).toEqual(
        'https://cozyurl/accounts/testslug/start?state=statekey&nonce=1234'
      )
    })
    it('should accept string value', () => {
      let url = getOAuthUrl({
        ...defaultConf,
        oAuthConf: { scope: 'thescope' }
      })
      expect(url).toEqual(
        'https://cozyurl/accounts/testslug/start?state=statekey&nonce=1234&scope=thescope'
      )
    })
    it('should should join array values with spaces', () => {
      let url = getOAuthUrl({
        ...defaultConf,
        oAuthConf: { scope: ['thescope', 'thescope2'] }
      })
      expect(url).toEqual(
        'https://cozyurl/accounts/testslug/start?state=statekey&nonce=1234&scope=thescope+thescope2'
      )
    })
  })
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
