import Socket, { getWebSocketUrl, getWebSocketToken } from './Socket'
import { Server } from 'mock-socket'

const COZY_URL = 'http://cozy.tools:8888'
const WS_URL = 'ws://cozy.tools:8888/realtime/'
const COZY_TOKEN = 'zvNpzsHILcXpnDBlUfmAqVuEEuyWvPYn'

describe('getWebSocketUrl', () => {
  it('should return WebSocket url from cozyClient', () => {
    const fakeCozyClient = { stackClient: {} }
    fakeCozyClient.stackClient.uri = 'https://a.cozy.url'
    expect(getWebSocketUrl(fakeCozyClient)).toBe('wss://a.cozy.url/realtime/')
    fakeCozyClient.stackClient.uri = COZY_URL
    expect(getWebSocketUrl(fakeCozyClient)).toBe(WS_URL)
    fakeCozyClient.stackClient.uri = 'https://b.cozy.url'
    expect(getWebSocketUrl(fakeCozyClient)).toBe('wss://b.cozy.url/realtime/')
    fakeCozyClient.stackClient.uri = 'http://b.cozy.url'
    expect(getWebSocketUrl(fakeCozyClient)).toBe('ws://b.cozy.url/realtime/')
  })
})

describe('getWebSocketToken', () => {
  it('should return web token from cozyClient', () => {
    const fakeCozyClient = { stackClient: { token: {} } }
    fakeCozyClient.stackClient.token.token = COZY_TOKEN
    expect(getWebSocketToken(fakeCozyClient)).toBe(COZY_TOKEN)
    fakeCozyClient.stackClient.token.token = 'token2'
    expect(getWebSocketToken(fakeCozyClient)).toBe('token2')
  })
  it('should return oauth token from cozyClient', () => {
    const fakeCozyClient = { stackClient: { token: {} } }
    fakeCozyClient.stackClient.token.accessToken = COZY_TOKEN
    expect(getWebSocketToken(fakeCozyClient)).toBe(COZY_TOKEN)
    fakeCozyClient.stackClient.token.accessToken = 'token2'
    expect(getWebSocketToken(fakeCozyClient)).toBe('token2')
  })
})

describe('Socket', () => {
  let socket

  beforeEach(() => {
    socket = new Socket(WS_URL, COZY_TOKEN)
  })

  afterEach(() => {
    socket.close()
    socket = null
  })

  it('should save url', () => {
    expect(socket._url).toBe(WS_URL)
  })

  it('should save token', () => {
    expect(socket._token).toBe(COZY_TOKEN)
  })

  it('should update token and launch authentication if is connected', () => {
    socket.updateAuthentication('refreshToken')
    expect(socket._token).toBe('refreshToken')

    socket.isConnected = jest.fn().mockImplementationOnce(() => true)
    socket.authentication = jest.fn()
    socket.updateAuthentication('refreshToken2')
    expect(socket._token).toBe('refreshToken2')
    expect(socket.isConnected.mock.calls.length).toBe(1)
    expect(socket.authentication.mock.calls.length).toBe(1)
  })

  describe('With Socket server', () => {
    let server

    beforeEach(() => {
      server = new Server(WS_URL)
    })

    afterEach(() => {
      server.stop()
    })

    it('should establish a realtime connection and close it', async done => {
      socket.on('onopen', () => {
        expect(socket.isConnected()).toBe(true)
        socket.close()
        expect(socket.isConnected()).toBe(false)
        expect(socket._socket).toBe(null)
        done()
      })
      await socket.connect()
    })

    it('should emit onmessage event', async done => {
      const msg = 'a server message to socket'
      socket.on('onmessage', event => {
        expect(event.data).toBe(msg)
        done()
      })
      await socket.connect()
      server.emit('message', msg)
    })

    it('should emit onerror event', async done => {
      socket.on('onerror', event => {
        expect(event.type).toBe('error')
        expect(socket.isConnected()).toBe(false)
        expect(socket._socket).toBe(null)
        done()
      })
      await socket.connect()
      server.simulate('error')
    })

    it('should emit onclose event', async done => {
      socket.on('onclose', () => {
        expect(socket.isConnected()).toBe(false)
        expect(socket._socket).toBe(null)
        done()
      })
      await socket.connect()
      expect(socket.isConnected()).toBe(true)
      socket.close()
    })

    it('should authenticate', async done => {
      server.on('connection', serverSocket => {
        serverSocket.on('message', data => {
          expect(JSON.parse(data)).toEqual({
            method: 'AUTH',
            payload: COZY_TOKEN
          })
          done()
        })
      })
      await socket.connect()
      expect(socket.isConnected()).toBe(true)
      socket.authentication()
    })

    describe('subscribe', () => {
      it('should subscribe with only type', async done => {
        server.on('connection', serverSocket => {
          serverSocket.on('message', event => {
            const data = JSON.parse(event)
            if (data.method !== 'AUTH') {
              expect(data).toEqual({
                method: 'SUBSCRIBE',
                payload: { type: 'io.cozy.bank.accounts' }
              })
              done()
            }
          })
        })
        socket.subscribe('io.cozy.bank.accounts')
      })

      it('should subscribe with type and id', async done => {
        server.on('connection', serverSocket => {
          serverSocket.on('message', event => {
            const data = JSON.parse(event)
            if (data.method !== 'AUTH') {
              expect(data).toEqual({
                method: 'SUBSCRIBE',
                payload: { type: 'io.cozy.bank.accounts', id: 'my_id' }
              })
              done()
            }
          })
        })
        socket.subscribe('io.cozy.bank.accounts', 'my_id')
      })
    })
  })
})
