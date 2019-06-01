import { Server } from 'mock-socket'
import RealtimeSocket from './RealtimeSocket'
import {
  serverMessagePromise,
  eventPromise,
  subscribePromise
} from './__tests_helpers__/timedPromise'

const wsUrl = 'wss://example.com:8888/realtime/'
const httpUrl = wsUrl.replace(/^ws/, 'http')
const wsFailUrl = 'ws://example.com:8887/fail_realtime/'

const protocol = 'io.cozy.websocket'
const token = '{my secret token}'

const event = 'message'
const authEvent = 'AUTH'

const id = '{my-id}'
const type = 'io.cozy.notes'
const action = 'CREATED'
const doc = { value: 'hello' }

const content = JSON.stringify({
  event: action,
  payload: { type, doc, id }
})
const contentWrongType = JSON.stringify({
  event: action,
  payload: { type: 'io.cozy.not_files', doc, id }
})
const contentWrongEvent = JSON.stringify({
  event: 'UPDATED',
  payload: { type, doc, id }
})
const contentWrongId = JSON.stringify({
  event: action,
  payload: { type, doc, id: '{wrong id}' }
})

describe('RealtimeSocket', () => {
  let server
  let failServer
  let socket

  beforeEach(() => {
    server = new Server(wsUrl)
    failServer = new Server(wsFailUrl, { verifyClient: () => false })
    socket = new RealtimeSocket()
  })

  afterEach(() => {
    socket.close()
    server.stop()
    failServer.stop()
  })

  describe('connect', () => {
    it('should send the correct protocol', async () => {
      server.close()
      server = new Server(wsUrl, { selectProtocol: () => protocol })
      await expect(socket.connect(wsUrl)).resolves.toBeDefined()
    })

    it('should allow an http cozy stack url', async () => {
      const connectionToServer = eventPromise(server, 'connection')
      socket.connect(httpUrl)
      await expect(connectionToServer).resolves.toBeDefined()
    })

    it('should authenticate when given a token', async () => {
      const messageEvent = serverMessagePromise(server)
      socket.connect(httpUrl, token)
      await expect(messageEvent).resolves.toEqual({
        method: authEvent,
        payload: token
      })
    })

    it('should not authenticate when not given a token', async () => {
      const messageEvent = serverMessagePromise(server)
      socket.connect(httpUrl)
      await expect(messageEvent).rejects.toBeDefined()
    })
  })

  describe('on closing', () => {
    describe('close from client', () => {
      it('should unsubscribe all handlers', async () => {
        await socket.connect(httpUrl)
        const event = eventPromise(socket, 'test')
        socket.close()
        socket.emit('test', true)
        await expect(event).rejects.toBeDefined()
      })
    })
    describe('close from server', () => {
      it('should unsubscribe all handlers', async () => {
        await socket.connect(httpUrl)
        const event = eventPromise(socket, 'test')
        const close = eventPromise(socket, 'close')
        server.close()
        await close // wait for close handler to act
        socket.emit('test', true)
        await expect(event).rejects.toBeDefined()
      })
    })
    describe('on error', () => {
      it('should unsubscribe all handlers', async () => {
        await socket.connect(httpUrl)
        const event = eventPromise(socket, 'test')
        const close = eventPromise(socket, 'close')
        server.simulate('error')
        await close // wait for close handler to act
        socket.emit('test', true)
        await expect(event).rejects.toBeDefined()
      })
    })
    describe('on connection fail', () => {
      it('should unsubscribe all handlers', async () => {
        const event = eventPromise(socket, 'test', resolve => resolve(true))
        const close = eventPromise(socket, 'close')
        socket.connect(wsFailUrl).catch(e => e)
        await close // wait for close handler to act
        socket.emit('test', true)
        await expect(event).rejects.toBeDefined()
      })
    })
  })

  describe('subscribe', () => {
    describe('with type and eventName', () => {
      const args = [action.toLowerCase(), type]

      it('should receive a message with correct type and event', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, content)
        await expect(sub).resolves.toEqual(doc)
      })

      it('should not receive a message with another type', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, contentWrongType)
        await expect(sub).rejects.toBeDefined()
      })

      it('should not receive a message with another event', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, contentWrongEvent)
        await expect(sub).rejects.toBeDefined()
      })
    })

    describe('with type, eventName and undefined id', () => {
      const args = [action.toLowerCase(), type, undefined]

      it('should receive a message with correct type and event', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, content)
        await expect(sub).resolves.toEqual(doc)
      })

      it('should not receive a message with another type', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, contentWrongType)
        await expect(sub).rejects.toBeDefined()
      })

      it('should not receive a message with another event', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, contentWrongEvent)
        await expect(sub).rejects.toBeDefined()
      })
    })

    describe('with type, eventName and id', () => {
      const args = [action.toLowerCase(), type, id]

      it('should receive a message with correct type, event and id', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, content)
        await expect(sub).resolves.toEqual(doc)
      })

      it('should not receive a message with another type', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, contentWrongType)
        await expect(sub).rejects.toBeDefined()
      })

      it('should not receive a message with another event', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, contentWrongEvent)
        await expect(sub).rejects.toBeDefined()
      })

      it('should not receive a message with another id', async () => {
        await socket.connect(httpUrl)
        const sub = subscribePromise(socket, args)
        server.emit(event, contentWrongId)
        await expect(sub).rejects.toBeDefined()
      })
    })
  })

  describe('unsubscribe', () => {
    const args = [action.toLowerCase(), type, id]

    it('should not receive unsubscribed messages', async () => {
      await socket.connect(httpUrl)
      const memory = {}
      const sub = subscribePromise(socket, args, undefined, memory)
      // side effect in function args are a bad pattern
      // please tell me if you find something better there
      expect(memory.handler).toBeDefined()
      socket.unsubscribe(...args, memory.handler)
      server.emit(event, content)
      await expect(sub).rejects.toBeDefined()
    })

    it('should let other handlers receive messages', async () => {
      await socket.connect(httpUrl)
      const handler = doc => doc
      const subBefore = subscribePromise(socket, args)
      socket.subscribe(...args, handler)
      const subAfter = subscribePromise(socket, args)
      socket.unsubscribe(...args, handler)
      server.emit(event, content)
      await expect(subBefore).resolves.toEqual(doc)
      await expect(subAfter).resolves.toEqual(doc)
    })
  })

  describe('unsubscribeAll', () => {
    it('should not receive anymore message', async () => {
      await socket.connect(httpUrl)
      const args = [action.toLowerCase(), type, id]
      const sub = subscribePromise(socket, args)
      socket.unsubscribeAll()
      server.emit(event, content)
      await expect(sub).rejects.toBeDefined()
    })
  })
})
