import { timedPromise } from './__tests_helpers__/timedPromise'

import MicroEE from 'microee'

import Realtime from './Realtime'
import RealtimeSocket from './RealtimeSocket'
jest.mock('./RealtimeSocket')
const ActualRealtimeSocket = jest.requireActual('./RealtimeSocket').default

const token = '{my-token}'
const uri = 'https://example.com:8888/realtime/'

const id = '{my-doc-id}'
const type = 'io.cozy.notes'
const action = 'updated'

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

describe('Realtime', () => {
  let realtime
  let socket

  beforeEach(async () => {
    const getHandlerAndId = ActualRealtimeSocket.getHandlerAndId
    RealtimeSocket.getHandlerAndId = jest.fn(getHandlerAndId)
    RealtimeSocket.prototype.connect.mockImplementation(function() {
      return this
    })
    RealtimeSocket.prototype.isOpen.mockReturnValue(true)
    realtime = new Realtime({ client })
    await realtime.ready
    socket = RealtimeSocket.mock.instances[0]
  })

  afterEach(() => {
    RealtimeSocket.mockReset()
  })

  describe('constructor', () => {
    it('should start a realtime socket to the stack', () => {
      expect(RealtimeSocket).toHaveBeenCalledTimes(1)
      expect(socket.connect.mock.calls[0][0]).toBe(uri)
    })

    it('should pass authentication', () => {
      expect(socket.connect.mock.calls[0][1]).toBe(token)
    })
  })

  describe('subscribe', () => {
    describe('to an online socket', () => {
      it('subscribe to the socket', async () => {
        const subscribe = socket.subscribe
        const handler = (...args) => args
        const withId = timedPromise(resolve => {
          subscribe.mockImplementationOnce((action, type, id, handler) =>
            resolve({ action, type, id, handler })
          )
          realtime.subscribe(action, type, id, handler)
        })
        const withoutId = timedPromise(resolve => {
          subscribe.mockImplementationOnce((action, type, handler, undef) =>
            resolve({ action, type, handler, undef })
          )
          realtime.subscribe(action, type, handler)
        })
        await expect(withId).resolves.toEqual({ action, type, id, handler })
        await expect(withoutId).resolves.toEqual({
          action,
          type,
          handler,
          undefined
        })
      })
    })

    describe('to an offline socket', () => {
      it('subscribe to the socket once connected', async () => {
        const subscribe = RealtimeSocket.prototype.subscribe
        const handler = (...args) => args
        realtime.disconnect()
        const withId = timedPromise(resolve => {
          subscribe.mockImplementationOnce((action, type, id, handler) =>
            resolve({ action, type, id, handler })
          )
          realtime.subscribe(action, type, id, handler)
        })
        const withoutId = timedPromise(resolve => {
          subscribe.mockImplementationOnce((action, type, handler, undef) =>
            resolve({ action, type, handler, undef })
          )
          realtime.subscribe(action, type, handler)
        })
        realtime.reconnect()
        await expect(withId).resolves.toEqual({ action, type, id, handler })
        await expect(withoutId).resolves.toEqual({
          action,
          type,
          handler,
          undefined
        })
      })
    })
  })

  describe('unsubscribe', () => {
    describe('to an online socket', () => {
      it('unsubscribe to the socket', async () => {
        const unsubscribe = socket.unsubscribe
        const handler = (...args) => args
        realtime.subscribe(action, type, id, handler)
        realtime.subscribe(action, type, handler)
        const withId = timedPromise(resolve => {
          unsubscribe.mockImplementationOnce((action, type, id, handler) =>
            resolve({ action, type, id, handler })
          )
        })
        const withoutId = timedPromise(resolve => {
          unsubscribe.mockImplementationOnce((action, type, handler, undef) =>
            resolve({ action, type, handler, undef })
          )
        })
        realtime.unsubscribe(action, type, id, handler)
        realtime.unsubscribe(action, type, handler)
        await expect(withId).resolves.toEqual({ action, type, id, handler })
        await expect(withoutId).resolves.toEqual({
          action,
          type,
          handler,
          undefined
        })
      })

      it('does not remove other subscriptions', async () => {
        const unsubscribe = socket.unsubscribe
        const handler = () => {}
        realtime.subscribe(action, type, id, handler)
        realtime.subscribe(action, type, handler)
        const withoutId = timedPromise(resolve => {
          unsubscribe.mockImplementationOnce((action, type, handler, undef) =>
            resolve({ action, type, undef })
          )
          realtime.unsubscribe(action, type, handler)
        })
        await expect(withoutId).resolves.toEqual({ action, type, undefined })
        expect(socket.unsubscribe).toHaveBeenCalledTimes(1)
      })
    })

    describe('to an offline socket', () => {
      it('should not subscribe to the socket once connected', async () => {
        realtime.disconnect()
        const handler = () => {}
        realtime.subscribe(action, type, id, handler)
        realtime.subscribe(action, type, handler)
        realtime.unsubscribe(action, type, id, handler)
        realtime.unsubscribe(action, type, handler)
        await realtime.reconnect()
        socket = RealtimeSocket.mock.instances[1]
        expect(socket.subscribe).not.toHaveBeenCalled()
      })

      it('does not remove other subscriptions', async () => {
        realtime.disconnect()
        const handler = () => {}
        realtime.subscribe(action, type, id, handler)
        realtime.subscribe(action, type, handler)
        realtime.unsubscribe(action, type, id, handler)
        await realtime.reconnect()
        socket = RealtimeSocket.mock.instances[1]
        expect(socket.subscribe).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('unsubscribeAll', () => {
    it('unsubscribe all current subscriptions', async () => {
      const handler = () => {}
      realtime.subscribe(action, type, id, handler)
      realtime.subscribe(action, type, handler)
      const withId = timedPromise(resolve => {
        socket.unsubscribe.mockImplementationOnce((action, type, id, handler) =>
          resolve({ action, type, id, handler })
        )
      })
      const withoutId = timedPromise(resolve => {
        socket.unsubscribe.mockImplementationOnce(
          (action, type, handler, undef) =>
            resolve({ action, type, handler, undef })
        )
      })
      await realtime.ready
      realtime.unsubscribeAll()
      await expect(withId).resolves.toEqual({ action, type, id, handler })
      await expect(withoutId).resolves.toEqual({
        action,
        type,
        handler,
        undef: undefined
      })
    })

    it('should not subscribe back on a reconnect', async () => {
      const handler = () => {}
      realtime.subscribe(action, type, id, handler)
      realtime.subscribe(action, type, handler)
      realtime.unsubscribeAll()
      await realtime.reconnect()
      socket = RealtimeSocket.mock.instances[1]
      expect(socket.subscribe).not.toHaveBeenCalled()
    })
  })

  describe('on cozy-client login', () => {
    it('should re-authenticate when already connected', async () => {
      const auth = timedPromise(resolve => {
        socket.authenticate.mockImplementation(token => resolve(token))
      })
      client.emit('login')
      await expect(auth).resolves.toBe(token)
    })

    it('should connect when not connected', async () => {
      realtime.disconnect()
      const connect = timedPromise(resolve => {
        RealtimeSocket.prototype.connect.mockImplementation((uri, token) =>
          resolve({ uri, token })
        )
      })
      client.emit('login')
      await expect(connect).resolves.toEqual({ uri, token })
    })
  })

  describe('on cozy-client logout', () => {
    it('should disconnect the socket', async () => {
      const close = timedPromise(resolve => {
        RealtimeSocket.prototype.close.mockImplementation(() => resolve(true))
      })
      client.emit('logout')
      await expect(close).resolves.toBeDefined()
    })

    it('should not reconnect', async () => {
      const connect = timedPromise(resolve => {
        RealtimeSocket.prototype.connect.mockImplementation(() => resolve(true))
      })
      client.emit('logout')
      await expect(connect).rejects.toBeDefined()
    })
  })

  describe('on cozy-client token refresh', () => {
    it('should authenticate again', async () => {
      const auth = timedPromise(resolve => {
        RealtimeSocket.prototype.authenticate.mockImplementation(token =>
          resolve(token)
        )
      })
      client.emit('tokenRefreshed')
      await expect(auth).resolves.toBe(token)
    })
  })

  describe('on navigator back online', () => {
    it('should reconnect', async () => {
      const connect = timedPromise(resolve => {
        RealtimeSocket.prototype.connect.mockImplementation(() => resolve(true))
      })
      window.dispatchEvent(new Event('online'))
      await expect(connect).resolves.toBeDefined()
    })
  })

  describe('on navigator unload', () => {
    it('should disconnect', async () => {
      const close = timedPromise(resolve => {
        RealtimeSocket.prototype.close.mockImplementation(() => resolve(true))
      })
      window.dispatchEvent(new Event('unload'))
      await expect(close).resolves.toBeDefined()
    })

    it('should remove all subscriptions', async () => {
      const handler = () => {}
      realtime.subscribe(action, type, id, handler)
      realtime.subscribe(action, type, handler)
      window.dispatchEvent(new Event('unload'))
      await realtime.load()
      socket = RealtimeSocket.mock.instances[1]
      expect(socket.subscribe).not.toHaveBeenCalled()
    })

    it('should stop monitoring client token refresh', async () => {
      window.dispatchEvent(new Event('unload'))
      await realtime.reconnect()
      const auth = timedPromise(resolve => {
        RealtimeSocket.prototype.authenticate.mockImplementation(token =>
          resolve(token)
        )
      })
      client.emit('tokenRefreshed')
      await expect(auth).rejects.toBeDefined()
    })

    it('should stop monitoring client login', async () => {
      window.dispatchEvent(new Event('unload'))
      const connect = timedPromise(resolve => {
        RealtimeSocket.prototype.connect.mockImplementation(() => resolve(true))
      })
      client.emit('login')
      await expect(connect).rejects.toBeDefined()
    })

    it('should stop monitoring client logout', async () => {
      window.dispatchEvent(new Event('unload'))
      await realtime.reconnect()
      const disconnect = timedPromise(resolve => {
        RealtimeSocket.prototype.close.mockImplementation(() => resolve(true))
      })
      client.emit('logout')
      await expect(disconnect).rejects.toBeDefined()
    })

    it('should stop monitoring window online event', async () => {
      window.dispatchEvent(new Event('unload'))
      const connect = timedPromise(resolve => {
        RealtimeSocket.prototype.connect.mockImplementation(() => resolve(true))
      })
      window.dispatchEvent(new Event('online'))
      await expect(connect).rejects.toBeDefined()
    })

    it('should stop monitoring window unload event', async () => {
      window.dispatchEvent(new Event('unload'))
      await realtime.reconnect()
      const disconnect = timedPromise(resolve => {
        RealtimeSocket.prototype.close.mockImplementation(() => resolve(true))
      })
      window.dispatchEvent(new Event('unload'))
      await expect(disconnect).rejects.toBeDefined()
    })
  })
})
