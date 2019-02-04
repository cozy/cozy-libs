import __RewireAPI__, { subscribe, subscribeAll } from '../src/index'

const MOCK_SERVER_DOMAIN = 'localhost:8880'

let mockGetSocket = jest.fn(() => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn()
}))

const mockConfig = {
  domain: MOCK_SERVER_DOMAIN,
  secure: false,
  token: 'blablablatoken'
}

describe('(cozy-realtime) API: ', () => {
  describe('subscribeAll:', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.resetModules()
      __RewireAPI__.__Rewire__('getCozySocket', mockGetSocket)
      // reset cozySocket global variable
      __RewireAPI__.__Rewire__('cozySocket', null)
    })

    afterEach(() => {
      __RewireAPI__.__ResetDependency__('getCozySocket')
      __RewireAPI__.__ResetDependency__('cozySocket')
    })

    it('should return a subscription with correct properties', () => {
      const subscription = subscribeAll(mockConfig, 'io.cozy.mocks')
      expect(mockGetSocket.mock.calls.length).toBe(1)
      expect(mockGetSocket.mock.calls[0][0]).toEqual(mockConfig)
      expect(subscription).toMatchSnapshot()
    })

    it('should call only once getCozySocket to avoid duplicating socket', () => {
      subscribeAll(mockConfig, 'io.cozy.mocks')
      subscribeAll(mockConfig, 'io.cozy.mocks2')
      subscribeAll(mockConfig, 'io.cozy.mocks3')
      expect(mockGetSocket.mock.calls[0][0]).toEqual(mockConfig)
      expect(mockGetSocket.mock.calls.length).toBe(1)
    })
    //
    ;['onCreate', 'onUpdate', 'onDelete'].forEach(propName => {
      const eventName = propName.replace('on', '').toLowerCase() + 'd'

      it(`subscription should return the subscription on ${propName} call`, () => {
        const subscription = subscribeAll(mockConfig, 'io.cozy.mocks')
        expect(subscription[propName](jest.fn())).toBe(subscription)
      })

      it(`subscription should subscribe to ${eventName} event on ${propName} call even without listener`, () => {
        const mockCozySocket = {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
        const mockDoctype = 'io.cozy.mocks'
        __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)

        const subscription = subscribeAll(mockConfig, mockDoctype)
        subscription[propName](jest.fn())
        expect(mockCozySocket.subscribe.mock.calls.length).toBe(1)
        expect(mockCozySocket.subscribe.mock.calls[0][0]).toBe(mockDoctype)
        expect(mockCozySocket.subscribe.mock.calls[0][1]).toBe(eventName)
      })

      it(`subscription should subscribe to ${eventName} event on ${propName} call with a listener and the default parser`, () => {
        const mockCozySocket = {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
        const mockDoctype = 'io.cozy.mocks'
        __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)
        const mockListener = jest.fn()
        const mockReceivedDoc = { _id: 123 }

        const subscription = subscribeAll(mockConfig, mockDoctype)
        subscription[propName](mockListener)
        expect(mockCozySocket.subscribe.mock.calls.length).toBe(1)
        // simulate listener call
        mockCozySocket.subscribe.mock.calls[0][2](mockReceivedDoc)
        expect(mockListener.mock.calls.length).toBe(1)
        expect(mockListener.mock.calls[0][0]).toBe(mockReceivedDoc)
      })

      it(`subscription should subscribe to ${eventName} event on ${propName} call with a listener and a custom parser`, () => {
        const mockCozySocket = {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
        const mockDoctype = 'io.cozy.mocks'
        __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)
        const mockListener = jest.fn()
        const mockParser = jest.fn(doc => ({
          idparsed: doc._id
        }))
        const mockReceivedDoc = { _id: 123 }
        const parsedDoc = mockParser(mockReceivedDoc)
        mockParser.mockClear()

        const subscription = subscribeAll(mockConfig, mockDoctype, mockParser)
        subscription[propName](mockListener)
        expect(mockCozySocket.subscribe.mock.calls.length).toBe(1)
        // simulate listener call
        mockCozySocket.subscribe.mock.calls[0][2](mockReceivedDoc)
        expect(mockListener.mock.calls.length).toBe(1)
        expect(mockParser.mock.calls.length).toBe(1)
        expect(mockListener.mock.calls[0][0]).toEqual(parsedDoc)
      })
    })

    it('should unsubscribe all events on unsubscribe call', () => {
      const mockCozySocket = {
        subscribe: jest.fn(),
        unsubscribe: jest.fn()
      }
      const mockDoctype = 'io.cozy.mocks'
      __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)

      const subscription = subscribeAll(mockConfig, mockDoctype)
      subscription.unsubscribe()
      expect(mockCozySocket.unsubscribe.mock.calls.length).toBe(3)
      expect(mockCozySocket.unsubscribe.mock.calls).toMatchSnapshot()
    })
  })
  describe('subscribe:', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.resetModules()
      __RewireAPI__.__Rewire__('getCozySocket', mockGetSocket)
      // reset cozySocket global variable
      __RewireAPI__.__Rewire__('cozySocket', null)
    })

    afterEach(() => {
      __RewireAPI__.__ResetDependency__('getCozySocket')
      __RewireAPI__.__ResetDependency__('cozySocket')
    })

    const mockDoc = {
      _id: '123doc'
    }

    it('should return a subscription with correct properties', () => {
      const subscription = subscribe(mockConfig, 'io.cozy.mocks', mockDoc)
      expect(mockGetSocket.mock.calls.length).toBe(1)
      expect(mockGetSocket.mock.calls[0][0]).toEqual(mockConfig)
      expect(subscription).toMatchSnapshot()
    })

    it('should call only once getCozySocket to avoid duplicating socket', () => {
      subscribe(mockConfig, 'io.cozy.mocks', mockDoc)
      subscribe(mockConfig, 'io.cozy.mocks2', mockDoc)
      subscribe(mockConfig, 'io.cozy.mocks3', mockDoc)
      expect(mockGetSocket.mock.calls[0][0]).toEqual(mockConfig)
      expect(mockGetSocket.mock.calls.length).toBe(1)
    })
    //
    ;['onUpdate', 'onDelete'].forEach(propName => {
      const eventName = propName.replace('on', '').toLowerCase() + 'd'

      it(`subscription should return the subscription on ${propName} call`, () => {
        const subscription = subscribe(mockConfig, 'io.cozy.mocks', mockDoc)
        expect(subscription[propName](jest.fn())).toBe(subscription)
      })

      it(`subscription should subscribe to ${eventName} event on ${propName} call even without listener`, () => {
        const mockCozySocket = {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
        const mockDoctype = 'io.cozy.mocks'
        __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)

        const subscription = subscribe(mockConfig, mockDoctype, mockDoc)
        subscription[propName](jest.fn())
        expect(mockCozySocket.subscribe.mock.calls.length).toBe(1)
        expect(mockCozySocket.subscribe.mock.calls[0][0]).toBe(mockDoctype)
        expect(mockCozySocket.subscribe.mock.calls[0][1]).toBe(eventName)
      })

      it(`subscription should subscribe to ${eventName} event on ${propName} call with a listener and the default parser`, () => {
        const mockCozySocket = {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
        const mockDoctype = 'io.cozy.mocks'
        __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)
        const mockListener = jest.fn()
        const mockReceivedDoc = { _id: 123 }

        const subscription = subscribe(mockConfig, mockDoctype, mockDoc)
        subscription[propName](mockListener)
        expect(mockCozySocket.subscribe.mock.calls.length).toBe(1)
        // simulate listener call
        mockCozySocket.subscribe.mock.calls[0][2](mockReceivedDoc)
        expect(mockListener.mock.calls.length).toBe(1)
        expect(mockListener.mock.calls[0][0]).toBe(mockReceivedDoc)
      })

      it(`subscription should subscribe to ${eventName} event on ${propName} call with a listener and a custom parser`, () => {
        const mockCozySocket = {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
        const mockDoctype = 'io.cozy.mocks'
        __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)
        const mockListener = jest.fn()
        const mockParser = jest.fn(doc => ({
          idparsed: doc._id
        }))
        const mockReceivedDoc = { _id: 123 }
        const parsedDoc = mockParser(mockReceivedDoc)
        mockParser.mockClear()

        const subscription = subscribe(
          mockConfig,
          mockDoctype,
          mockDoc,
          mockParser
        )
        subscription[propName](mockListener)
        expect(mockCozySocket.subscribe.mock.calls.length).toBe(1)
        // simulate listener call
        mockCozySocket.subscribe.mock.calls[0][2](mockReceivedDoc)
        expect(mockListener.mock.calls.length).toBe(1)
        expect(mockParser.mock.calls.length).toBe(1)
        expect(mockListener.mock.calls[0][0]).toEqual(parsedDoc)
      })
    })

    it('should unsubscribe all events on unsubscribe call', () => {
      const mockCozySocket = {
        subscribe: jest.fn(),
        unsubscribe: jest.fn()
      }
      const mockDoctype = 'io.cozy.mocks'
      __RewireAPI__.__Rewire__('cozySocket', mockCozySocket)

      const subscription = subscribe(mockConfig, mockDoctype)
      subscription.unsubscribe()
      expect(mockCozySocket.unsubscribe.mock.calls.length).toBe(2)
      expect(mockCozySocket.unsubscribe.mock.calls).toMatchSnapshot()
    })
  })
})
