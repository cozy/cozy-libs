import Socket from './Socket'
import { Server } from 'mock-socket'

const WS_URL = 'ws://cozy.tools:8888/realtime/'
const COZY_TOKEN = 'zvNpzsHILcXpnDBlUfmAqVuEEuyWvPYn'

describe('Socket', () => {
  let fakeServer, socket

  beforeEach(() => {
    socket = new Socket(WS_URL, COZY_TOKEN)
    fakeServer = new Server(WS_URL)
  })

  afterEach(() => {
    socket.close()
    fakeServer.stop()
  })

  it('should establish a realtime connection and close it', async done => {
    socket.on('open', () => {
      expect(socket.isOpen()).toBe(true)
      socket.close()
      expect(socket.isOpen()).toBe(false)
      expect(socket._webSocket).toBe(null)
      done()
    })
    await socket.connect()
  })

  it('should authenticate when it connect', async done => {
    fakeServer.on('connection', serverSocket => {
      serverSocket.on('message', data => {
        expect(JSON.parse(data)).toEqual({
          method: 'AUTH',
          payload: COZY_TOKEN
        })
        done()
      })
    })
    await socket.connect()
  })

  it('should update authentication if is connected', async done => {
    const newToken = 'nDBlUfmAqVuzvNpzsHILcXpEEuyWvPYn'
    fakeServer.on('connection', serverSocket => {
      serverSocket.on('message', data => {
        const { payload: token } = JSON.parse(data)
        if (token === newToken) {
          expect(JSON.parse(data)).toEqual({
            method: 'AUTH',
            payload: newToken
          })
          done()
        }
      })
    })
    await socket.connect()
    socket.updateAuthentication(newToken)
  })

  it('should emit open event', async done => {
    socket.on('open', () => {
      expect(socket.isOpen()).toBe(true)
      done()
    })
    await socket.connect()
  })

  it('should emit message with options and doc parameter', async done => {
    const type = 'io.cozy.accounts'
    const id = 1234
    const doc = 'doc'
    const event = 'created'

    socket.on('message', (options, _doc) => {
      expect(options).toEqual({ eventName: event, id, type })
      expect(_doc).toBe(doc)
      done()
    })
    await socket.connect()

    fakeServer.emit(
      'message',
      JSON.stringify({ payload: { type, id, doc }, event })
    )
  })

  it('should emit error event', async done => {
    socket.on('error', event => {
      expect(event.type).toBe('error')
      expect(socket.isOpen()).toBe(false)
      done()
    })
    await socket.connect()

    fakeServer.simulate('error')
  })

  it('should emit close event', async done => {
    socket.on('close', () => {
      expect(socket.isOpen()).toBe(false)
      done()
    })
    await socket.connect()
    expect(socket.isOpen()).toBe(true)
    socket.close()
  })

  describe('subscribe', () => {
    it('should subscribe with only type', async done => {
      fakeServer.on('connection', serverSocket => {
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
      fakeServer.on('connection', serverSocket => {
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
