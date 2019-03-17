import ServerMock from './ServerMock.js'

const MOCK_SERVER_DOMAIN = 'localhost:8880'
const REALTIME_URL = `ws://${MOCK_SERVER_DOMAIN}/realtime/`

const mockConfig = {
  domain: MOCK_SERVER_DOMAIN,
  secure: false,
  token: 'blablablatoken'
}

// mock-socket server
let server
jest.useFakeTimers() // mock-socket use timers to delay onopen call

const fixtures = {
  // Main documents sent by socket server
  fooDoc: { type: 'io.cozy.foo', id: '8ddb5dd969ac40a8a42abe8511605364' },
  anotherFooDoc: {
    type: 'io.cozy.foo',
    id: 'e14cacd28fd84328bd43a394d627b89a'
  },
  barDoc: { type: 'io.cozy.bar', id: 'f6ad50b13d6340759a57497500d75381' }
}

let realtime
let CozyRealtime

describe('(cozy-realtime) API: ', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    realtime = require('../src/legacy').default
    CozyRealtime = require('../src/CozyRealtime').CozyRealtime
    server = new ServerMock(REALTIME_URL)
  })

  afterEach(() => {
    server.stop()
  })

  describe('subscribe all docs:', () => {
    it('should have a correctly configured socket, cozySocket and listeners on subscribe call and reset listeners on unsubscribe (all docs)', async () => {
      const getListeners = require('../src/legacy').getListeners
      const getCozySocket = require('../src/legacy').getCozySocket
      const getSocket = require('../src/legacy').getSocket
      const subscription = realtime
        .subscribe(mockConfig, 'io.cozy.mocks')
        .onCreate(jest.fn())
        .onUpdate(jest.fn())
        .onDelete(jest.fn())
      jest.runAllTimers()
      expect(getListeners().size).toBe(1) // one doctype listener here
      expect(getListeners()).toMatchSnapshot('listeners')
      expect(await getSocket()).toMatchSnapshot('websocket')
      expect(getCozySocket()).toMatchSnapshot('cozySocket')
      // unsubscribe
      subscription.unsubscribe()
      jest.runAllTimers()
      expect(getListeners().size).toBe(0)
    })

    it('should have a correctly configured socket, cozySocket and listeners on subscribe call and reset listeners on unsubscribe (one doc)', async () => {
      const getListeners = require('../src/legacy').getListeners
      const getCozySocket = require('../src/legacy').getCozySocket
      const getSocket = require('../src/legacy').getSocket
      const subscription = realtime
        .subscribe(mockConfig, 'io.cozy.mocks', 'id1234')
        .onCreate(jest.fn())
        .onUpdate(jest.fn())
        .onDelete(jest.fn())
      jest.runAllTimers()
      expect(getListeners().size).toBe(1) // one doctype listener here
      expect(getListeners()).toMatchSnapshot('listeners')
      expect(await getSocket()).toMatchSnapshot('websocket')
      expect(getCozySocket()).toMatchSnapshot('cozySocket')
      // unsubscribe
      subscription.unsubscribe()
      jest.runAllTimers()
      expect(getListeners().size).toBe(0)
    })
  })

  describe('subscribe', () => {
    it('should send AUTH message', () => {
      realtime.subscribe(mockConfig, 'io.cozy.foo')

      server.stepForward()

      expect(
        server.received(
          JSON.stringify({
            method: 'AUTH',
            payload: mockConfig.token
          })
        )
      ).toBe(true)
    })

    describe('onCreate', () => {
      it('should send SUBSCRIBE message', async () => {
        const getSocket = require('../src/legacy').getSocket

        realtime.subscribe(mockConfig, 'io.cozy.foo').onCreate(jest.fn())

        server.stepForward()
        await getSocket()
        jest.runAllTimers()

        expect(
          server.received(
            JSON.stringify({
              method: 'SUBSCRIBE',
              payload: { type: 'io.cozy.foo' }
            })
          )
        ).toBe(true)
      })

      it("should receive 'created' events on doctypes", () => {
        const fooCreateHandler = jest.fn()
        realtime.subscribe(mockConfig, 'io.cozy.foo').onCreate(fooCreateHandler)
        jest.runAllTimers()

        server.sendDoc(fixtures.fooDoc, 'created')
        server.sendDoc(fixtures.barDoc, 'created')

        expect(fooCreateHandler).toHaveBeenCalledTimes(1)
        expect(fooCreateHandler).toHaveBeenCalledWith(fixtures.fooDoc)
      })
    })

    describe('onUpdate', () => {
      it("should receive 'updated' events on doctypes", () => {
        const fooUpdateHandler = jest.fn()
        realtime.subscribe(mockConfig, 'io.cozy.foo').onUpdate(fooUpdateHandler)
        jest.runAllTimers()

        server.sendDoc(fixtures.fooDoc, 'updated')
        server.sendDoc(fixtures.barDoc, 'updated')

        expect(fooUpdateHandler).toHaveBeenCalledTimes(1)
        expect(fooUpdateHandler).toHaveBeenCalledWith(fixtures.fooDoc)
      })

      it("should receive 'updated' events on documents", () => {
        const fooUpdateHandler = jest.fn()
        const fooDocumentUpdateHandler = jest.fn()
        realtime.subscribe(mockConfig, 'io.cozy.foo').onUpdate(fooUpdateHandler)
        realtime
          .subscribe(mockConfig, 'io.cozy.foo', {
            docId: fixtures.anotherFooDoc.id
          })
          .onUpdate(fooDocumentUpdateHandler)
        jest.runAllTimers()

        server.sendDoc(fixtures.fooDoc, 'updated')
        server.sendDoc(fixtures.anotherFooDoc, 'updated')

        expect(fooUpdateHandler).toHaveBeenCalledTimes(2)
        expect(fooUpdateHandler).toHaveBeenCalledWith(fixtures.fooDoc)
        expect(fooUpdateHandler).toHaveBeenCalledWith(fixtures.anotherFooDoc)

        expect(fooDocumentUpdateHandler).toHaveBeenCalledTimes(1)
        expect(fooDocumentUpdateHandler).toHaveBeenCalledWith(
          fixtures.anotherFooDoc
        )
      })
    })

    describe('onDelete', () => {
      it("should receive 'deleted' events on doctypes", () => {
        const fooDeleteHandler = jest.fn()
        realtime.subscribe(mockConfig, 'io.cozy.foo').onDelete(fooDeleteHandler)
        jest.runAllTimers()

        server.sendDoc(fixtures.fooDoc, 'deleted')
        server.sendDoc(fixtures.barDoc, 'deleted')

        expect(fooDeleteHandler).toHaveBeenCalledTimes(1)
        expect(fooDeleteHandler).toHaveBeenCalledWith(fixtures.fooDoc)
      })

      it("should receive 'deleted' events on documents", () => {
        const fooDeleteHandler = jest.fn()
        const fooDocumentDeleteHandler = jest.fn()

        realtime.subscribe(mockConfig, 'io.cozy.foo').onDelete(fooDeleteHandler)

        realtime
          .subscribe(mockConfig, 'io.cozy.foo', {
            docId: fixtures.anotherFooDoc.id
          })
          .onDelete(fooDocumentDeleteHandler)
        jest.runAllTimers()

        server.sendDoc(fixtures.fooDoc, 'deleted')
        server.sendDoc(fixtures.anotherFooDoc, 'deleted')

        expect(fooDeleteHandler).toHaveBeenCalledTimes(2)
        expect(fooDeleteHandler).toHaveBeenCalledWith(fixtures.fooDoc)
        expect(fooDeleteHandler).toHaveBeenCalledWith(fixtures.anotherFooDoc)

        expect(fooDocumentDeleteHandler).toHaveBeenCalledTimes(1)
        expect(fooDocumentDeleteHandler).toHaveBeenCalledWith(
          fixtures.anotherFooDoc
        )
      })
    })

    describe('unsubscribe', () => {
      it('should unsubscribe from onCreate ', () => {
        const fooCreateHandler = jest.fn()

        const subscription = realtime
          .subscribe(mockConfig, 'io.cozy.foo')
          .onCreate(fooCreateHandler)

        subscription.unsubscribe()

        server.sendDoc(fixtures.fooDoc, 'created')

        expect(fooCreateHandler).toHaveBeenCalledTimes(0)
      })

      it('should unsubscribe doctype from onUpdate', () => {
        const fooCreateHandler = jest.fn()

        const subscription = realtime
          .subscribe(mockConfig, 'io.cozy.foo')
          .onUpdate(fooCreateHandler)

        subscription.unsubscribe()

        server.sendDoc(fixtures.fooDoc, 'updated')

        expect(fooCreateHandler).toHaveBeenCalledTimes(0)
      })

      it('should unsubscribe document from onUpdate', () => {
        const fooCreateHandler = jest.fn()

        const subscription = realtime
          .subscribe(mockConfig, 'io.cozy.foo', { docID: fixtures.fooDoc.id })
          .onUpdate(fooCreateHandler)

        subscription.unsubscribe()

        server.sendDoc(fixtures.fooDoc, 'updated')

        expect(fooCreateHandler).toHaveBeenCalledTimes(0)
      })

      it('should unsubscribe doctype from onDelete', () => {
        const fooCreateHandler = jest.fn()

        const subscription = realtime
          .subscribe(mockConfig, 'io.cozy.foo')
          .onDelete(fooCreateHandler)

        subscription.unsubscribe()

        server.sendDoc(fixtures.fooDoc, 'deleted')

        expect(fooCreateHandler).toHaveBeenCalledTimes(0)
      })

      it('should unsubscribe document from onDelete', () => {
        const fooCreateHandler = jest.fn()

        const subscription = realtime
          .subscribe(mockConfig, 'io.cozy.foo', { docID: fixtures.fooDoc.id })
          .onDelete(fooCreateHandler)

        subscription.unsubscribe()

        server.sendDoc(fixtures.fooDoc, 'deleted')

        expect(fooCreateHandler).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('CozyRealtime', () => {
    const fooSelector = {
      type: 'io.cozy.foo'
    }

    const events = ['created', 'updated', 'deleted']

    describe('subscribe', () => {
      it('should send AUTH message', () => {
        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'created', jest.fn())

        server.stepForward()

        expect(
          server.received(
            JSON.stringify({
              method: 'AUTH',
              payload: mockConfig.token
            })
          )
        ).toBe(true)
      })

      it('should send SUBSCRIBE message', async () => {
        const realtime = CozyRealtime.init(mockConfig)

        server.stepForward()

        realtime.subscribe(fooSelector, 'created', jest.fn())

        await realtime._socketPromise
        server.stepForward()

        expect(
          server.received(
            JSON.stringify({
              method: 'SUBSCRIBE',
              payload: { type: 'io.cozy.foo' }
            })
          )
        ).toBe(true)
      })

      it('should no send same SUBSCRIBE message twice', async () => {
        const realtime = CozyRealtime.init(mockConfig)

        server.stepForward()

        await realtime.subscribe(fooSelector, 'created', jest.fn())
        await realtime.subscribe(fooSelector, 'created', jest.fn())

        server.stepForward()

        expect(
          server.receivedTimes(
            JSON.stringify({
              method: 'SUBSCRIBE',
              payload: { type: 'io.cozy.foo' }
            })
          )
        ).toBe(1)
      })

      for (const event of events) {
        it(`on '${event}' event, should receive document of given doctype`, () => {
          const handler = jest.fn()

          const realtime = CozyRealtime.init(mockConfig)

          server.stepForward()

          realtime.subscribe(fooSelector, event, handler)

          server.sendDoc(fixtures.fooDoc, event)
          server.sendDoc(fixtures.barDoc, event)

          expect(handler).toHaveBeenCalledTimes(1)
          expect(handler).toHaveBeenCalledWith(fixtures.fooDoc)
        })
      }

      it('should receive updated documents of given doctype', () => {
        const fooUpdateHandler = jest.fn()
        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'updated', fooUpdateHandler)

        server.sendDoc(fixtures.fooDoc, 'updated')
        server.sendDoc(fixtures.barDoc, 'updated')

        expect(fooUpdateHandler).toHaveBeenCalledTimes(1)
        expect(fooUpdateHandler).toHaveBeenCalledWith(fixtures.fooDoc)
      })

      it('should receive updated document with given id', () => {
        const fooUpdateHandler = jest.fn()
        const fooDocumentUpdateHandler = jest.fn()
        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'updated', fooUpdateHandler)
        realtime.subscribe(
          { ...fooSelector, id: fixtures.anotherFooDoc.id },
          'updated',
          fooDocumentUpdateHandler
        )

        server.sendDoc(fixtures.fooDoc, 'updated')
        server.sendDoc(fixtures.anotherFooDoc, 'updated')

        expect(fooUpdateHandler).toHaveBeenCalledTimes(2)
        expect(fooUpdateHandler).toHaveBeenCalledWith(fixtures.fooDoc)
        expect(fooUpdateHandler).toHaveBeenCalledWith(fixtures.anotherFooDoc)

        expect(fooDocumentUpdateHandler).toHaveBeenCalledTimes(1)
        expect(fooDocumentUpdateHandler).toHaveBeenCalledWith(
          fixtures.anotherFooDoc
        )
      })

      it('should receive deleted documents of given doctypes', () => {
        const fooDeleteHandler = jest.fn()
        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'deleted', fooDeleteHandler)

        server.sendDoc(fixtures.fooDoc, 'deleted')
        server.sendDoc(fixtures.barDoc, 'deleted')

        expect(fooDeleteHandler).toHaveBeenCalledTimes(1)
        expect(fooDeleteHandler).toHaveBeenCalledWith(fixtures.fooDoc)
      })

      it("should receive 'deleted' events on documents", () => {
        const fooDeleteHandler = jest.fn()
        const fooDocumentDeleteHandler = jest.fn()

        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'deleted', fooDeleteHandler)
        realtime.subscribe(
          { ...fooSelector, id: fixtures.anotherFooDoc.id },
          'deleted',
          fooDocumentDeleteHandler
        )

        server.sendDoc(fixtures.fooDoc, 'deleted')
        server.sendDoc(fixtures.anotherFooDoc, 'deleted')

        expect(fooDeleteHandler).toHaveBeenCalledTimes(2)
        expect(fooDeleteHandler).toHaveBeenCalledWith(fixtures.fooDoc)
        expect(fooDeleteHandler).toHaveBeenCalledWith(fixtures.anotherFooDoc)

        expect(fooDocumentDeleteHandler).toHaveBeenCalledTimes(1)
        expect(fooDocumentDeleteHandler).toHaveBeenCalledWith(
          fixtures.anotherFooDoc
        )
      })
    })

    describe('unsubscribe', () => {
      it('should stop receiving created documents with given doctype', () => {
        const fooCreateHandler = jest.fn()

        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'created', fooCreateHandler)
        realtime.unsubscribe(fooSelector, 'created', fooCreateHandler)

        server.sendDoc(fixtures.fooDoc, 'created')

        expect(fooCreateHandler).toHaveBeenCalledTimes(0)
      })

      it('should stop receiving updated documents with given doctype', () => {
        const fooUpdateHandler = jest.fn()

        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'updated', fooUpdateHandler)
        realtime.unsubscribe(fooSelector, 'updated', fooUpdateHandler)

        server.sendDoc(fixtures.fooDoc, 'updated')

        expect(fooUpdateHandler).toHaveBeenCalledTimes(0)
      })

      it('should stop receiving updated document with given id', () => {
        const fooUpdateHandler = jest.fn()

        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(
          { ...fooSelector, id: fixtures.fooDoc.id },
          'updated',
          fooUpdateHandler
        )
        realtime.unsubscribe(
          { ...fooSelector, id: fixtures.fooDoc.id },
          'updated',
          fooUpdateHandler
        )

        server.sendDoc(fixtures.fooDoc, 'updated')

        expect(fooUpdateHandler).toHaveBeenCalledTimes(0)
      })

      it('should stop receiving deleted documents with given doctype', () => {
        const fooDeleteHandler = jest.fn()

        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(fooSelector, 'deleted', fooDeleteHandler)
        realtime.unsubscribe(fooSelector, 'deleted', fooDeleteHandler)

        server.sendDoc(fixtures.fooDoc, 'deleted')

        expect(fooDeleteHandler).toHaveBeenCalledTimes(0)
      })

      it('should stop receiving deleted document with given id', () => {
        const fooDeleteHandler = jest.fn()

        const realtime = CozyRealtime.init(mockConfig)
        realtime.subscribe(
          { ...fooSelector, id: fixtures.fooDoc.id },
          'deleted',
          fooDeleteHandler
        )
        realtime.unsubscribe(
          { ...fooSelector, id: fixtures.fooDoc.id },
          'deleted',
          fooDeleteHandler
        )

        server.sendDoc(fixtures.fooDoc, 'deleted')

        expect(fooDeleteHandler).toHaveBeenCalledTimes(0)
      })

      it('should stop receiving document for only one handler', () => {
        const fooCreateHandler = jest.fn()
        const anotherFooCreateHandler = jest.fn()

        const realtime = CozyRealtime.init(mockConfig)

        realtime.subscribe(fooSelector, 'created', fooCreateHandler)
        realtime.subscribe(fooSelector, 'created', anotherFooCreateHandler)

        realtime.unsubscribe(fooSelector, 'created', fooCreateHandler)

        server.sendDoc(fixtures.fooDoc, 'created')

        expect(anotherFooCreateHandler).toHaveBeenCalledWith(fixtures.fooDoc)
      })
    })
  })
})
