import { Server } from 'mock-socket'
import RealtimeSocket from './RealtimeSocket'
import { eventPromise } from './__tests_helpers__/timedPromise'

const wsUrl = 'wss://example.com:8888/realtime/'
const wsFailUrl = 'wss://example.com:8887/fail_realtime/'
const event = 'message'
const content = JSON.stringify({
  event: 'UPDATED',
  payload: {
    type: 'io.cozy.notes',
    id: '{my-id}',
    doc: { value: 'hello' }
  }
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
    it('should establish a web socket', async () => {
      const connectionToServer = eventPromise(server, 'connection')
      socket.connect(wsUrl)
      await expect(connectionToServer).resolves.toBeDefined()
    })

    it('should emit an "open" event', async () => {
      const openEvent = eventPromise(socket, 'open')
      socket.connect(wsUrl)
      await expect(openEvent).resolves.toBeDefined()
    })

    it('should resolve to the current instance', async () => {
      await expect(socket.connect(wsUrl)).resolves.toBe(socket)
    })

    describe('with a connection error', () => {
      it('should reject', async () => {
        await expect(socket.connect(wsFailUrl)).rejects.toBeDefined()
      })

      it('should emit an "error" event', async () => {
        const errorEvent = eventPromise(socket, 'error')
        await socket.connect(wsFailUrl).catch(e => e)
        await expect(errorEvent).resolves.toBeDefined()
      })

      it('should close the connection', async () => {
        await socket.connect(wsFailUrl).catch(e => e)
        expect(socket.isOpen()).toBeFalsy()
      })
    })

    describe('with an immediate error', () => {
      it('should not emit an "open" event', async () => {
        const openEvent = eventPromise(socket, 'open')
        socket.connect(wsUrl).catch(e => e)
        server.simulate('error')
        await expect(openEvent).rejects.toBeDefined()
      })
    })
  })

  describe('whenReady', () => {
    it('should reject when connection is on error', async () => {
      await socket.connect(wsFailUrl).catch(e => e)
      await expect(socket.whenReady()).rejects.toBeDefined()
    })

    it('should resolve to the current socket when connection is ready', async () => {
      socket.connect(wsUrl)
      await expect(socket.whenReady()).resolves.toBe(socket)
    })

    it('should reject when socket is closed', async () => {
      await socket.connect(wsUrl)
      socket.close()
      await expect(socket.whenReady()).rejects.toBeDefined()
    })
  })

  describe('when there is an error', () => {
    it('should close the connection', async () => {
      await socket.connect(wsUrl)
      server.simulate('error')
      expect(socket.isOpen()).toBeFalsy()
    })

    it('should emit an "error" event', async () => {
      await socket.connect(wsUrl)
      const errorEvent = eventPromise(socket, 'error')
      server.simulate('error')
      await expect(errorEvent).resolves.toBeDefined()
    })

    it('should not handle messages anymore', async () => {
      await socket.connect(wsUrl)
      const messageEvent = eventPromise(socket, 'message')
      server.simulate('error')
      server.emit(event, content)
      await expect(messageEvent).rejects.toBeDefined()
    })

    it('should send a "close" event', async () => {
      await socket.connect(wsUrl)
      const closeEvent = eventPromise(socket, 'close')
      server.simulate('error')
      await expect(closeEvent).resolves.toBeDefined()
    })
  })

  describe('when connection is closed by server', () => {
    it('should close the connection', async () => {
      await socket.connect(wsUrl)
      server.close()
      expect(socket.isOpen()).toBeFalsy()
    })

    it('should emit a "close" event', async () => {
      await socket.connect(wsUrl)
      const closeEvent = eventPromise(socket, 'close')
      server.close()
      await expect(closeEvent).resolves.toBeDefined()
    })
  })

  describe('close', () => {
    it('should close the connection', async () => {
      await socket.connect(wsUrl)
      socket.close()
      expect(socket.isOpen()).toBeFalsy()
    })

    it('should emit a "close" message', async () => {
      await socket.connect(wsUrl)
      const closeEvent = eventPromise(socket, 'close')
      socket.close()
      await expect(closeEvent).resolves.toBeDefined()
    })

    it('should not handle messages anymore', async () => {
      await socket.connect(wsUrl)
      const messageEvent = eventPromise(socket, 'message')
      socket.close()
      server.emit(event, content)
      await expect(messageEvent).rejects.toBeDefined()
    })
  })

  describe('isOpen', () => {
    describe('when connection is opened', () => {
      it('should return `true`', async () => {
        await socket.connect(wsUrl)
        expect(socket.isOpen()).toBeTruthy()
      })
    })

    describe('when connection is connecting', () => {
      it('should return `false`', async () => {
        await socket.connect(wsUrl)
        // there should be a better way to similaire a CONNECTING WebSocket
        socket.socket.readyState = WebSocket.CONNECTING
        expect(socket.isOpen()).toBeFalsy()
      })
    })

    describe('when there is no connection', () => {
      it('should return `false`', () => {
        // no connect
        expect(socket.isOpen()).toBeFalsy()
      })
    })

    describe('when connection is closing', () => {
      it('should return `false`', async () => {
        await socket.connect(wsUrl)
        // there should be a better way to similaire a CLOSING WebSocket
        socket.socket.readyState = WebSocket.CLOSING
        expect(socket.isOpen()).toBeFalsy()
      })
    })

    describe('when connection has been closed', () => {
      it('should return `false`', async () => {
        await socket.connect(wsUrl)
        socket.close()
        expect(socket.isOpen()).toBeFalsy()
      })
    })

    describe('when connection is closed', () => {
      it('should return `false`', async () => {
        await socket.connect(wsUrl)
        // there should be a better way to similaire a CLOSED WebSocket
        socket.socket.readyState = WebSocket.CLOSED
        expect(socket.isOpen()).toBeFalsy()
      })
    })

    describe('receiving messages', () => {
      it('should receive a "message" event', async () => {
        const messageEvent = eventPromise(socket, 'message')
        await socket.connect(wsUrl)
        server.emit(event, content)
        await expect(messageEvent).resolves.toEqual(content)
      })
    })
  })
})
