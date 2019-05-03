import CozyRealtime, {
  generateKey,
  getWebSocketUrl,
  getWebSocketToken,
  EVENT_CREATED
} from '.'
import { Server } from 'mock-socket'
import MicroEE from 'microee'

const COZY_URL = 'http://cozy.tools:8888'
const WS_URL = 'ws://cozy.tools:8888/realtime/'
const COZY_TOKEN = 'zvNpzsHILcXpnDBlUfmAqVuEEuyWvPYn'
class CozyClient {
  stackClient = {
    uri: COZY_URL,
    token: {
      token: COZY_TOKEN
    }
  }
}
MicroEE.mixin(CozyClient)
const cozyClient = new CozyClient()
const pause = time => new Promise(resolve => setTimeout(resolve, time))

describe('CozyRealtime', () => {
  let realtime, cozyStack

  beforeEach(() => {
    realtime = new CozyRealtime({ cozyClient })
    cozyStack = new Server(WS_URL)
    cozyStack.emitMessage = (type, doc, event, id) => {
      cozyStack.emit(
        'message',
        JSON.stringify({ payload: { type, doc, id }, event })
      )
    }
  })

  afterEach(() => {
    realtime.unsubscribeAll()
    cozyStack.stop()
  })

  const type = 'io.cozy.bank.accounts'
  const id = 'doc_id'
  const fakeDoc = { _id: id, title: 'title1' }

  describe('subscribe', () => {
    it('should launch handler when document is created', async done => {
      await realtime.onCreate({ type }, doc => {
        expect(doc).toEqual(fakeDoc)
        done()
      })

      cozyStack.emitMessage(type, fakeDoc, 'CREATED')
    })

    it('should throw an error when config has id for onCreate', () => {
      expect(() => realtime.onCreate({ type, id: 'my_id' }, () => {})).toThrow()
    })

    it('should launch handler when document is updated', async done => {
      await realtime.onUpdate({ type }, doc => {
        expect(doc).toEqual(fakeDoc)
        done()
      })

      cozyStack.emitMessage(type, fakeDoc, 'UPDATED')
    })

    it('should launch handler when document with id is updated', async done => {
      await realtime.onUpdate({ type, id: fakeDoc._id }, doc => {
        expect(doc).toEqual(fakeDoc)
        done()
      })

      cozyStack.emitMessage(type, fakeDoc, 'UPDATED', fakeDoc._id)
    })

    it('should launch handler when document is deleted', async done => {
      await realtime.onDelete({ type }, doc => {
        expect(doc).toEqual(fakeDoc)
        done()
      })

      cozyStack.emitMessage(type, fakeDoc, 'DELETED')
    })

    it('should launch handler when document with id is deleted', async done => {
      await realtime.onDelete({ type, id: fakeDoc._id }, doc => {
        expect(doc).toEqual(fakeDoc)
        done()
      })

      cozyStack.emitMessage(type, fakeDoc, 'DELETED', fakeDoc._id)
    })

    it('should relauch socket subscribe after an error', async () => {
      const handler = jest.fn()
      await realtime.onCreate({ type }, handler)
      realtime._retryDelay = 100

      expect(realtime._socket.isOpen()).toBe(true)
      cozyStack.simulate('error')
      expect(realtime._socket.isOpen()).toBe(false)
      cozyStack.emitMessage(type, fakeDoc, 'CREATED')
      expect(handler.mock.calls.length).toBe(0)

      await pause(200)
      expect(realtime._socket.isOpen()).toBe(true)
      cozyStack.emitMessage(type, fakeDoc, 'CREATED')
      expect(handler.mock.calls.length).toBe(1)
    })
  })

  describe('unsubscribe', () => {
    let handlerCreate, handlerUpdate, handlerDelete

    beforeEach(async () => {
      handlerCreate = jest.fn()
      handlerUpdate = jest.fn()
      handlerDelete = jest.fn()
      await realtime.onCreate({ type }, handlerCreate)
      await realtime.onUpdate({ type }, handlerUpdate)
      await realtime.onDelete({ type }, handlerDelete)
      await realtime.onCreate({ type: 'io.cozy.accounts' }, handlerCreate)
    })

    afterEach(() => {
      realtime.unsubscribeAll()
    })

    it('should unsubscribe handlerCreate with type, eventName and handler', () => {
      expect(realtime._socket.isOpen()).toBe(true)
      expect(realtime._numberOfHandlers).toBe(4)
      realtime.unsubscribe({ type, eventName: EVENT_CREATED }, handlerCreate)
      expect(realtime._numberOfHandlers).toBe(3)
      expect(realtime._socket.isOpen()).toBe(true)
    })

    it('should unsubscribe handlerCreate with type and eventName', () => {
      expect(realtime._socket.isOpen()).toBe(true)
      expect(realtime._numberOfHandlers).toBe(4)
      realtime.unsubscribe({ type, eventName: EVENT_CREATED })
      expect(realtime._numberOfHandlers).toBe(3)
      expect(realtime._socket.isOpen()).toBe(true)
    })

    it('should unsubscribe handlerCreate with type', () => {
      expect(realtime._socket.isOpen()).toBe(true)
      expect(realtime._numberOfHandlers).toBe(4)
      realtime.unsubscribe({ type })
      expect(realtime._numberOfHandlers).toBe(1)
      expect(realtime._socket.isOpen()).toBe(true)
    })

    it('should unsubscribe all events', () => {
      expect(realtime._socket.isOpen()).toBe(true)
      expect(realtime._numberOfHandlers).toBe(4)
      realtime.unsubscribeAll()
      expect(realtime._numberOfHandlers).toBe(0)
      expect(realtime._socket.isOpen()).toBe(false)
    })
  })

  describe('events', () => {
    it('should emit error when retry limit is exceeded', async done => {
      realtime._retryLimit = 0

      realtime.on('error', () => done())
      const handler = jest.fn()

      await realtime.onCreate({ type }, handler)
      expect(realtime._socket.isOpen()).toBe(true)
      cozyStack.simulate('error')
    })
  })

  describe('authentication', () => {
    it('should update socket authentication when client login', async () => {
      realtime._socket.updateAuthentication = jest.fn()
      cozyClient.emit('login')
      expect(realtime._socket.updateAuthentication.mock.calls.length).toBe(1)
    })

    it('should update socket authentication when client token refreshed ', async () => {
      realtime._socket.updateAuthentication = jest.fn()
      cozyClient.emit('login')
      expect(realtime._socket.updateAuthentication.mock.calls.length).toBe(1)
    })
  })
})

describe('generateKey', () => {
  it('should return key from config', () => {
    let config = { type: 'io.cozy.bank.accounts', eventName: EVENT_CREATED }
    expect(generateKey(config)).toBe('io.cozy.bank.accounts\\created')
    config = {
      type: 'io.cozy.bank.accounts',
      eventName: EVENT_CREATED,
      id: 'dzqezfd'
    }
    expect(generateKey(config)).toBe('io.cozy.bank.accounts\\created\\dzqezfd')
    config = { type: 'io.cozy.bank.accounts', id: 'dzqezfd' }
    expect(generateKey(config)).toBe('io.cozy.bank.accounts\\dzqezfd')
  })
})

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
