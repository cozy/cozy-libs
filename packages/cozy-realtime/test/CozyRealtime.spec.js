import omit from 'lodash/omit'
import pick from 'lodash/pick'

import { CozyRealtime } from '../src/CozyRealtime'
import { RealtimeSubscriptions } from '../src/RealtimeSubscriptions'

describe('CozyRealtime', () => {
  const options = {
    domain: 'cozy.tools:8080',
    secure: true,
    token: 'zvNpzsHILcXpnDBlUfmAqVuEEuyWvPYn'
  }

  const optionsWithUrl = {
    ...pick(options, ['token']),
    url: 'https://cozy.tools:8080'
  }

  const selector = { type: 'io.cozy.foo' }

  const socketMock = {
    send: jest.fn()
  }

  afterEach(() => {
    jest.restoreAllMocks()
    socketMock.send.mockClear()
  })

  describe('constructor', () => {
    beforeEach(() => {
      jest.spyOn(CozyRealtime.prototype, '_connect')
    })

    it('should initialize Realtime with domain', () => {
      expect(() => new CozyRealtime(options)).not.toThrow()
    })

    it('should initialize Realtime with url', () => {
      expect(() => new CozyRealtime(optionsWithUrl)).not.toThrow()
    })

    it('should initialize Realtime with unsecure url', () => {
      const realtime = new CozyRealtime({
        ...optionsWithUrl,
        url: 'http://cozy.tools:8080'
      })
      expect(realtime._secure).toBe(false)
    })

    it('should throw error when both domain and url are missing', () => {
      expect(() => new CozyRealtime(omit(options, ['domain', 'url']))).toThrow()
    })

    it('should throw error when token is missing', () => {
      expect(() => new CozyRealtime(omit(options, ['token']))).toThrow()
    })

    it('should throw error url is invalid', () => {
      expect(
        () =>
          new CozyRealtime({ ...omit(options, ['domain']), url: 'invalid url' })
      ).toThrow()
    })

    it('should throw error when domain is invalid', () => {
      expect(() => new CozyRealtime({ ...options, domain: {} })).toThrow()
    })

    it('should call _connect()', () => {
      new CozyRealtime(options)
      expect(CozyRealtime.prototype._connect).toHaveBeenCalled()
    })
  })

  describe('init', () => {
    it('shoud return CozyRealtime instance', () => {
      const realtime = CozyRealtime.init(options)
      expect(realtime instanceof CozyRealtime).toBe(true)
    })
  })

  describe('subscribe', () => {
    beforeEach(() => {
      jest.spyOn(RealtimeSubscriptions.prototype, 'addHandler')
      jest.spyOn(CozyRealtime.prototype, '_sendSubscribeMessage')
    })

    it('shoud throw error if handler is not a function', () => {
      const realtime = new CozyRealtime(options)
      expect(() =>
        realtime.subscribe(selector, 'created', 'myStringHandler')
      ).toThrow()
    })

    it('should store handler', () => {
      const realtime = new CozyRealtime(options)
      const handler = () => {}
      realtime.subscribe(selector, 'created', handler)
      expect(RealtimeSubscriptions.prototype.addHandler).toHaveBeenCalledTimes(
        1
      )
      expect(RealtimeSubscriptions.prototype.addHandler).toHaveBeenCalledWith(
        selector,
        'created',
        handler
      )
    })

    it('should call send message', () => {
      const realtime = new CozyRealtime(options)
      const handler = () => {}
      realtime.subscribe(selector, 'created', handler)
      expect(
        CozyRealtime.prototype._sendSubscribeMessage
      ).toHaveBeenCalledTimes(1)
      expect(CozyRealtime.prototype._sendSubscribeMessage).toHaveBeenCalledWith(
        selector
      )
    })
  })

  describe('unsubscribe', () => {
    beforeEach(() => {
      jest.spyOn(RealtimeSubscriptions.prototype, 'removeHandler')
    })

    it('should remove handler', () => {
      const handler = () => {}
      const realtime = new CozyRealtime(options)
      realtime.unsubscribe(selector, 'updated', handler)
      expect(
        RealtimeSubscriptions.prototype.removeHandler
      ).toHaveBeenCalledTimes(1)
      expect(
        RealtimeSubscriptions.prototype.removeHandler
      ).toHaveBeenCalledWith(selector, 'updated', handler)
    })
  })

  describe('_connect', () => {
    beforeEach(() => {
      jest.spyOn(CozyRealtime.prototype, '_createWebSocket')
    })

    it('should create WebSocket', () => {
      new CozyRealtime(options)
      expect(CozyRealtime.prototype._createWebSocket).toHaveBeenCalledWith(
        'wss://cozy.tools:8080/realtime/',
        'io.cozy.websocket'
      )
    })

    it('should handle socket.onopen', async () => {
      const mockedSocket = {
        set onopen(func) {
          func()
        },
        send: jest.fn()
      }

      CozyRealtime.prototype._createWebSocket.mockReturnValue(mockedSocket)

      jest.spyOn(CozyRealtime.prototype, '_handleSocketOpen')

      const realtime = new CozyRealtime(options)
      const socket = await realtime._socketPromise

      expect(CozyRealtime.prototype._handleSocketOpen).toHaveBeenCalled()
      expect(socket).toBe(mockedSocket)
    })

    it('should handle socket.onerror', () => {
      CozyRealtime.prototype._createWebSocket.mockReturnValue({
        set onerror(func) {
          func()
        }
      })

      jest.spyOn(CozyRealtime.prototype, '_handleError')

      new CozyRealtime(options)

      expect(CozyRealtime.prototype._handleError).toHaveBeenCalled()
    })
  })

  describe('_handleError', () => {
    it('should call onError callback', () => {
      const onError = jest.fn()
      const realtime = new CozyRealtime({ ...options, onError })
      realtime._handleError(new Error('Test Error'))
      expect(onError).toHaveBeenCalledWith(new Error('Test Error'))
    })

    it('should do nothing if no onError is passed', () => {
      const realtime = new CozyRealtime({ ...options })
      expect(() => {
        realtime._handleError(new Error('Test Error'))
      }).not.toThrow()
    })
  })

  describe('_handleSocketClose', () => {
    const realtime = new CozyRealtime(options)

    beforeEach(() => {
      jest.spyOn(realtime, '_stopListenningUnload')
      jest.spyOn(realtime, '_retry')

      realtime._handleSocketClose(new CloseEvent(null, { wasClean: true }))
    })

    it('shoud reset _socketPromise', () => {
      expect(realtime._socketPromise).toBe(null)
    })

    it('should call _stopListenningUnload', () => {
      expect(realtime._stopListenningUnload).toHaveBeenCalled()
    })

    it('should not call retry for clean event', () => {
      expect(realtime._retry).not.toHaveBeenCalled()
    })

    it('should call retry for not clean event', () => {
      realtime._handleSocketClose(new CloseEvent(null, { wasClean: false }))
      expect(realtime._retry).toHaveBeenCalled()
    })
  })

  describe('_handleSocketOpen', () => {
    const realtime = new CozyRealtime(options)

    realtime.subscribe(selector, 'created', () => {})

    beforeEach(() => {
      jest.spyOn(realtime, '_listenUnload')
      jest.spyOn(realtime, '_sendSubscribeMessage')

      realtime._handleSocketOpen(socketMock)
    })

    it('should reset retry information', () => {
      expect(realtime._retries).toBe(0)
      expect(realtime._retryDelay).toBe(1000)
    })

    it('should reset message log', () => {
      expect(realtime._log).toHaveLength(0)
    })

    it('should call _listenUnload', () => {
      expect(realtime._listenUnload).toHaveBeenCalledWith(socketMock)
    })

    it('should send AUTH message', () => {
      expect(socketMock.send).toHaveBeenCalledWith(
        JSON.stringify({
          method: 'AUTH',
          payload: options.token
        })
      )
    })

    it('should call _sendSubscribeMessage', () => {
      expect(realtime._sendSubscribeMessage).toHaveBeenCalledWith(selector)
    })
  })

  describe('_handleSocketMessage', () => {
    const realtime = new CozyRealtime(options)

    beforeEach(() => {
      jest.spyOn(RealtimeSubscriptions.prototype, 'handle')
    })

    it('should pass message to subscriptions', () => {
      realtime._handleSocketMessage(
        new MessageEvent(null, {
          data: JSON.stringify({
            event: 'created',
            payload: {
              type: 'io.cozy.foo',
              doc: {
                type: 'io.cozy.foo',
                title: 'Test document'
              }
            }
          })
        })
      )

      expect(RealtimeSubscriptions.prototype.handle).toHaveBeenCalledWith(
        {
          type: 'io.cozy.foo'
        },
        'created',
        {
          type: 'io.cozy.foo',
          title: 'Test document'
        }
      )
    })

    it('should handle error message', () => {
      jest.spyOn(realtime, '_handleError')

      realtime._handleSocketMessage(
        new MessageEvent(null, {
          data: JSON.stringify({
            event: 'error',
            payload: {
              title: 'Error',
              code: 'ERROR_CODE',
              source: 'Error source',
              status: 'Error status'
            }
          })
        })
      )

      const expectedError = new Error('Error')
      expectedError.code = 'ERROR_CODE'
      expectedError.source = 'Error source'
      expectedError.status = 'Error status'

      expect(realtime._handleError).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('_retry', () => {
    jest.useFakeTimers()

    const onDisconnect = jest.fn()
    const realtime = new CozyRealtime({ ...options, onDisconnect })

    const closeEvent = new CloseEvent(null, { wasClean: false })

    beforeEach(() => {
      jest.spyOn(realtime, '_connect')
    })

    it('should update retry information', () => {
      realtime._retry(closeEvent)
      expect(realtime._retries).toBe(1)
      expect(realtime._retryDelay).toBe(2000)
      expect(realtime._connect).not.toHaveBeenCalled()
    })

    it('should call _connect', () => {
      jest.runAllTimers()
      expect(realtime._connect).toHaveBeenCalled()
    })

    it('should call onDisconnect', () => {
      for (let i = 0; i < 3; i++) {
        realtime._retry(closeEvent)
      }
      expect(onDisconnect).toHaveBeenCalledWith(closeEvent)
    })

    it('should do nothing when onDisconnect is not specified', () => {
      delete realtime._onDisconnect
      expect(() => realtime._retry(closeEvent)).not.toThrow()
    })
  })

  describe('_sendSubscribeMessage', () => {
    const realtime = new CozyRealtime(options)
    realtime._socketPromise = Promise.resolve(socketMock)

    const expectedRawMessage = JSON.stringify({
      method: 'SUBSCRIBE',
      payload: {
        type: 'io.cozy.foo'
      }
    })

    it('should send SUBSCRIBE message to stack', async () => {
      await realtime._sendSubscribeMessage(selector)
      expect(socketMock.send).toHaveBeenCalledWith(expectedRawMessage)
    })

    it('should not sent message which have already been sent', async () => {
      await realtime._sendSubscribeMessage(selector)
      expect(socketMock.send).not.toHaveBeenCalled()
    })

    it('should send SUBSCRIBE message to stack for document', async () => {
      await realtime._sendSubscribeMessage({
        ...selector,
        id: '4994a0bcf5474bbc9090a3755048093a'
      })

      const expectedRawDocumentMessage = JSON.stringify({
        method: 'SUBSCRIBE',
        payload: {
          type: 'io.cozy.foo',
          id: '4994a0bcf5474bbc9090a3755048093a'
        }
      })

      expect(socketMock.send).toHaveBeenCalledWith(expectedRawDocumentMessage)
    })

    it('should catch socket send error', async () => {
      jest.spyOn(realtime, '_handleError')
      const mockedSocketError = new Error('Mocked socket error')
      const erroredSocketMock = {
        send: jest.fn().mockImplementation(() => {
          throw mockedSocketError
        })
      }

      realtime._socketPromise = Promise.resolve(erroredSocketMock)

      await realtime._sendSubscribeMessage({ type: 'io.cozy.bar' })

      expect(realtime._handleError).toHaveBeenCalledWith(mockedSocketError)
    })
  })
})
