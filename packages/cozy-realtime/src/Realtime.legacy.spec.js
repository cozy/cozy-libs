// legacy tests, with minimal modifications
import Realtime from './Realtime'
import RealtimeSocket from './RealtimeSocket'

import { Server } from 'mock-socket'
import MicroEE from 'microee'

const token = '{my-token}'
const uri = 'https://example.com:8888/realtime/'
const wsUrl = 'wss://example.com:8888/realtime/'

const id = '{my-doc-id}'
const type = 'io.cozy.notes'
const action = 'created'
const doc = { _id: id, title: 'title1' }

class CozyClient {
  getStackClient() {
    return {
      getAccessToken: () => token,
      uri: uri
    }
  }
}
MicroEE.mixin(CozyClient)
const client = new CozyClient()

const pause = time => new Promise(resolve => setTimeout(resolve, time))

describe('Realtime', () => {
  let realtime
  let cozyStack

  beforeEach(async () => {
    cozyStack = new Server(wsUrl)
    cozyStack.emitMessage = (type, doc, event, id) => {
      cozyStack.emit(
        'message',
        JSON.stringify({ payload: { type, doc, id }, event })
      )
    }
    realtime = new Realtime({ client, backoff: 0 })
  })

  afterEach(() => {
    cozyStack.stop()
    jest.restoreAllMocks()
  })

  describe('subscribe', () => {
    it('should launch handler when document is created', async done => {
      await realtime.subscribe('created', type, val => {
        expect(val).toEqual(doc)
        done()
      })
      cozyStack.emitMessage(type, doc, 'CREATED')
    })

    it('should throw an error when config has id for created event', async () => {
      expect(() =>
        realtime.subscribe('created', type, 'my_id', () => {})
      ).toThrow()
    })

    it('should launch handler when document is updated', async done => {
      await realtime.subscribe('updated', type, val => {
        expect(val).toEqual(doc)
        done()
      })
      cozyStack.emitMessage(type, doc, 'UPDATED')
    })

    it('should launch handler when document with id is updated', async done => {
      await realtime.subscribe('updated', type, id, val => {
        expect(val).toEqual(doc)
        done()
      })
      cozyStack.emitMessage(type, doc, 'UPDATED', id)
    })

    it('should launch all handler when receive updated document', async () => {
      const handler = jest.fn()
      await realtime.subscribe('updated', type, handler)
      await realtime.subscribe('updated', type, id, handler)
      cozyStack.emitMessage(type, doc, 'UPDATED', id)
      await pause(100)
      expect(handler.mock.calls.length).toBe(2)
    })

    it('should launch handler when document is deleted', async done => {
      await realtime.subscribe('deleted', type, val => {
        expect(val).toEqual(doc)
        done()
      })
      cozyStack.emitMessage(type, doc, 'DELETED')
    })

    it('should launch handler when document with id is deleted', async done => {
      await realtime.subscribe('deleted', type, id, val => {
        expect(val).toEqual(doc)
        done()
      })
      cozyStack.emitMessage(type, doc, 'DELETED', id)
    })

    it('should relaunch socket subscribe after an error', async () => {
      const handler = jest.fn()
      await realtime.subscribe('created', type, handler)
      cozyStack.simulate('error')
      cozyStack.emitMessage(type, doc, 'CREATED')
      expect(handler.mock.calls.length).toBe(0)
      await pause(200)
      cozyStack.emitMessage(type, doc, 'CREATED')
      expect(handler.mock.calls.length).toBe(1)
    })

    it('should relaunch socket with same parameters', async () => {
      const handler = jest.fn()

      await realtime.subscribe('created', type, handler)
      const spy = jest.spyOn(RealtimeSocket.prototype, 'subscribe')
      await realtime.subscribe('updated', type, handler)
      await realtime.subscribe('updated', type, id, handler)
      await realtime.unsubscribe('created', type, handler)
      await pause(10)

      await realtime.reconnect()
      expect(spy).toHaveBeenCalledTimes(4)
      expect(spy.mock.calls[0][0]).toEqual(spy.mock.calls[2][0]) // type
      expect(spy.mock.calls[0][1]).toEqual(spy.mock.calls[2][1]) // id
      expect(spy.mock.calls[1][0]).toEqual(spy.mock.calls[3][0]) // type
      expect(spy.mock.calls[1][1]).toEqual(spy.mock.calls[3][1]) // id
    })

    it('should launch only one connection when multiple subscribe is call', async () => {
      const handler = jest.fn()
      const spy = jest.spyOn(RealtimeSocket.prototype, 'constructor')
      realtime.subscribe('created', type, handler)
      realtime.subscribe('created', type, handler)
      await pause(10)
      // should not launch other sockets because of subscribes
      expect(spy.mock.calls.length).toBe(0)
      cozyStack.emitMessage(type, doc, 'CREATED')
      expect(handler.mock.calls.length).toBe(2)
    })
  })

  describe('unsubscribe', () => {
    let handlerCreate, handlerUpdate, handlerDelete

    beforeEach(async () => {
      handlerCreate = jest.fn()
      handlerUpdate = jest.fn()
      handlerDelete = jest.fn()
      await realtime.subscribe('created', type, handlerCreate)
      await realtime.subscribe('updated', type, handlerUpdate)
      await realtime.subscribe('deleted', type, handlerDelete)
      await realtime.subscribe('created', 'io.cozy.accounts', handlerCreate)
    })

    afterEach(() => {
      realtime.unsubscribeAll()
    })

    it('should unsubscribe a created event', () => {
      realtime.unsubscribe('created', type, handlerCreate)
      realtime.unsubscribe('updated', type, handlerUpdate)
      realtime.unsubscribe('deleted', type, handlerDelete)
      realtime.unsubscribe('created', 'io.cozy.accounts', handlerCreate)
    })

    it('should stop receiving created documents with given doctype', () => {
      expect(handlerCreate.mock.calls.length).toBe(0)
      realtime.unsubscribe('created', type, handlerCreate)
      cozyStack.emitMessage(type, doc, 'CREATED')
      expect(handlerCreate.mock.calls.length).toBe(0)
    })

    it('should unsubscribe all events', () => {
      realtime.unsubscribeAll()
      cozyStack.emitMessage(type, doc, 'CREATED')
      expect(handlerCreate.mock.calls.length).toBe(0)
    })

    it(`should not unsubscribe 'error' event`, done => {
      realtime.on('error', () => done())
      realtime.unsubscribeAll()
      realtime.emit('error')
    })
  })

  xdescribe('events', () => {
    it('should emit error when retry limit is exceeded', () => {
      // Not implemented
      // Exponential backoff should be a better pattern for network failures
    })
  })

  describe('authentication', () => {
    it('should update socket authentication when client logs in', async () => {
      cozyStack.stop()
      realtime.unload()
      await pause(50)
      // server onMessage should be registered before connection
      const auth = jest.fn()
      cozyStack = new Server(wsUrl)
      cozyStack.on('connection', socket =>
        socket.on('message', json => {
          const data = JSON.parse(json)
          if (data.method == 'AUTH') auth()
        })
      )
      realtime = new Realtime({ client, backoff: 0 })
      await pause(50)
      client.emit('tokenRefreshed')
      await pause(50)
      expect(auth).toBeCalledTimes(2)
    })

    it('should update socket authentication when client token is refreshed', async () => {
      cozyStack.stop()
      realtime.unload()
      await pause(50)
      // server onMessage should be registered before connection
      const auth = jest.fn()
      cozyStack = new Server(wsUrl)
      cozyStack.on('connection', socket =>
        socket.on('message', json => {
          const data = JSON.parse(json)
          if (data.method == 'AUTH') auth()
        })
      )
      realtime = new Realtime({ client, backoff: 0 })
      await pause(50)
      client.emit('tokenRefreshed')
      await pause(50)
      expect(auth).toBeCalledTimes(2)
    })
  })
})
