import Realtime from './Realtime'
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
const COZY_CLIENT = new CozyClient()

describe('getWebSocketUrl', () => {
  let server

  beforeEach(() => {
    server = new Server(WS_URL)
  })

  afterEach(() => {
    server.stop()
  })

  it('should launch handler after subscribe', async done => {
    const type = 'io.cozy.bank.accounts'
    const realtime = new Realtime(COZY_CLIENT)
    const options = { type, eventName: 'created' }
    const doc1 = { title: 'title1' }
    const doc2 = { title: 'title2' }

    const handler = jest
      .fn()
      .mockImplementationOnce(data => {
        expect(data).toEqual(doc1)
      })
      .mockImplementationOnce(data => {
        expect(data).toEqual(doc2)
        done()
      })

    await realtime.subscribe(options, handler)
    server.emit(
      'message',
      JSON.stringify({ payload: { type, doc: doc1 }, event: 'CREATED' })
    )
    expect(realtime._socket.isConnected()).toBe(true)

    await realtime.unsubscribe(options, handler)
    server.emit(
      'message',
      JSON.stringify({ payload: { type, doc: doc2 }, event: 'CREATED' })
    )
    expect(realtime._socket).toBe(null)
    expect(handler.mock.calls.length).toBe(1)

    await realtime.subscribe(options, handler)
    server.emit(
      'message',
      JSON.stringify({ payload: { type, doc: doc2 }, event: 'CREATED' })
    )
    expect(handler.mock.calls.length).toBe(2)
  })
})
