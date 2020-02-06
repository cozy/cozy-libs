import CozyClient from 'cozy-client'

export default function testFlagAPI(flag) {
  afterEach(() => {
    flag.reset()
  })

  describe('flag', () => {
    it('should return the requested flag when passed a single parameter', () => {
      flag('test', true)
      expect(flag('test')).toBe(true)
    })

    it('should set the flag when passed two parameters', () => {
      expect(flag('test')).toBeNull()

      flag('test', true)
      expect(flag('test')).toBe(true)
    })

    if (flag.store) {
      describe('observable', () => {
        beforeEach(() => {
          jest.spyOn(flag.store, 'emit')
        })
        it('should emit events', () => {
          flag('test', true)
          expect(flag.store.emit).toHaveBeenCalled()
        })
      })
    }
  })

  describe('listFlags', () => {
    it('should return all the flag keys sorted', () => {
      const expectedFlags = ['test', 'feature', 'thing']
      expectedFlags.forEach(expectedFlag => flag(expectedFlag, true))

      const flags = flag.list()

      expect(flags).toEqual(['feature', 'test', 'thing'])
    })
  })

  describe('resetFlags', () => {
    it('should reset all the flags', () => {
      ;['test', 'feature', 'thing'].forEach(expectedFlag =>
        flag(expectedFlag, true)
      )

      expect(flag.list()).toHaveLength(3)

      flag.reset()

      expect(flag.list()).toHaveLength(0)
    })
  })
  describe('initializeFromRemote', () => {
    it('should initialize from the remote stack', async () => {
      const client = new CozyClient({})
      const flagResponseFixture = {
        data: {
          type: 'io.cozy.settings',
          id: 'io.cozy.settings.flags',
          attributes: {
            has_feature1: true,
            has_feature2: false,
            number_of_foos: 10,
            bar_config: { qux: 'quux' }
          },
          links: {
            self: '/settings/flags'
          }
        }
      }
      client.stackClient.fetchJSON = jest.fn(() => flagResponseFixture)
      await flag.initializeFromRemote(client)
      expect(flag('has_feature1')).toBe(true)
      expect(flag('has_feature2')).toBe(false)
      expect(flag('number_of_foos')).toBe(10)
      expect(flag('bar_config')).toEqual({ qux: 'quux' })
    })
  })
}
