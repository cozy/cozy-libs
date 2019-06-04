import { timedPromise } from './__tests_helpers__/timedPromise'

import MicroEE from 'microee'

import Realtime from './Realtime'
import RealtimeSocket from './RealtimeSocket'
jest.mock('./RealtimeSocket')
const ActualRealtimeSocket = jest.requireActual('./RealtimeSocket').default

const token = '{my-token}'
const uri = 'https://example.com:8888/realtime/'

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

  beforeEach(async () => {
    const getHandlerAndId = ActualRealtimeSocket.getHandlerAndId
    RealtimeSocket.getHandlerAndId = jest.fn(getHandlerAndId)
    RealtimeSocket.prototype.connect.mockImplementation(function() {
      return this
    })
    RealtimeSocket.prototype.isOpen.mockReturnValue(true)
    realtime = new Realtime({ client })
    await realtime.ready
  })

  afterEach(() => {
    RealtimeSocket.mockReset()
  })

  describe('after multiple failures', () => {
    beforeEach(async () => {
      for (let i = 0; i < 3; i++) {
        // 0: 200ms, 1: 400ms, 2: 800ms,
        await realtime.reconnect()
      }
    })

    it('should not reconnect immediatly', async () => {
      // next try should be 1.6s
      const connect = timedPromise(async resolve => {
        await realtime.reconnect()
        resolve(true)
      }, 1000)
      await expect(connect).rejects.toBeDefined()
    })

    it('should reconnect after a long time', async () => {
      // next try should be 1.6s
      const connect = timedPromise(async resolve => {
        await realtime.reconnect()
        resolve(true)
      }, 5000)
      await expect(connect).resolves.toBeDefined()
    })

    it('should reset after navigator is back online', async () => {
      // next try should be 1.6s
      const connect = timedPromise(async resolve => {
        RealtimeSocket.prototype.connect.mockImplementation(() => resolve(true))
        window.dispatchEvent(new Event('online'))
      }, 1000)
      await expect(connect).resolves.toBeDefined()
    })

    it('should reset after a successfull try', async () => {
      // next try should be 1.6s
      await realtime.reconnect()
      // wait enough to mark the connection as success
      await new Promise(resolve => window.setTimeout(() => resolve(), 1500))
      // then try again
      const connect = timedPromise(async resolve => {
        RealtimeSocket.prototype.connect.mockImplementation(() => resolve(true))
        window.dispatchEvent(new Event('online'))
      }, 1000)
      await realtime.reconnect()
      await expect(connect).resolves.toBeDefined()
    })
  })
})
