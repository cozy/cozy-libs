import { CozyRealtime } from '../src/CozyRealtime'

describe('CozyRealtime', () => {
  describe('init', () => {
    it('shoud intialize realtime', () => {
      const options = {
        domain: 'cozy.tools:8080',
        secure: true,
        token: 'abcdef12324'
      }

      const realtime = CozyRealtime.init(options)
      expect(realtime instanceof CozyRealtime).toBe(true)
    })
  })
})
