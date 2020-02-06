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

  describe('initialization', () => {
    const remoteFlags = {
      has_feature1: true,
      has_feature2: false,
      number_of_foos: 10,
      bar_config: { qux: 'quux' },
      from_remote: true
    }
    const flagRemoteResponse = {
      data: {
        type: 'io.cozy.settings',
        id: 'io.cozy.settings.flags',
        attributes: remoteFlags,
        links: {
          self: '/settings/flags'
        }
      }
    }

    const domFlags = {
      has_feature1: true,
      has_feature2: false,
      number_of_foos: 10,
      bar_config: { qux: 'quux' },
      from_remote: false
    }

    const setup = () => {
      const client = new CozyClient({})
      client.stackClient.fetchJSON = jest.fn(() => flagRemoteResponse)
      return { client }
    }

    if (typeof document !== 'undefined') {
      it('should initialize from DOM', async () => {
        let div
        try {
          div = document.createElement('div')
          div.dataset.cozy = JSON.stringify({ flags: domFlags })
          document.body.appendChild(div)
          await flag.initialize()
          expect(flag('has_feature1')).toBe(true)
          expect(flag('has_feature2')).toBe(false)
          expect(flag('number_of_foos')).toBe(10)
          expect(flag('bar_config')).toEqual({ qux: 'quux' })
        } finally {
          document.body.removeChild(div)
        }
      })
    }

    it('should initialize from the remote stack', async () => {
      const { client } = setup()
      await flag.initialize(client)
      expect(flag('has_feature1')).toBe(true)
      expect(flag('has_feature2')).toBe(false)
      expect(flag('from_remote')).toBe(true)
      expect(flag('number_of_foos')).toBe(10)
      expect(flag('bar_config')).toEqual({ qux: 'quux' })
    })
  })
}
