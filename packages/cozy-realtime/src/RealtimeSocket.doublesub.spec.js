// This file test a specific scenario:
// What is succeeding if one subscribes multiple times
// to the exact same event with the exact same handler.
// It is externalised so we can change our behaviour
// more easily in the future.

import { Server } from 'mock-socket'
import RealtimeSocket from './RealtimeSocket'

const wsUrl = 'wss://example.com:8888/realtime/'
const httpUrl = wsUrl.replace(/^ws/, 'http')

const token = '{my secret token}'

const id = '{my-id}'
const type = 'io.cozy.notes'
const action = 'created'
const doc = { value: 'hello' }

const wait = time => new Promise(resolve => setTimeout(resolve, time))
function emit(server, event, type, id, doc) {
  server.emit(
    'message',
    JSON.stringify({ payload: { type, doc, id }, event: event.toUpperCase() })
  )
}

describe('RealtimeSocket', () => {
  let server
  let socket
  let options

  beforeEach(() => {
    server = new Server(wsUrl)
    options = {}
  })

  afterEach(() => {
    socket.close()
    server.stop()
  })

  it('should allow double call to subscribe', async () => {
    socket = new RealtimeSocket(options)
    socket.connect(httpUrl, token)
    const handler = jest.fn()
    socket.subscribe(action, type, id, handler)
    const subscribe = socket.subscribe(action, type, id, handler)
    // check is resolves and not throws
    await expect(subscribe).resolves.not.toBe(false)
  })

  it('should send only one SUBSCRIBE to the stack', async () => {
    const callback = jest.fn()
    server.on('connection', socket =>
      socket.on('message', json => {
        const data = JSON.parse(json)
        if (data.method == 'SUBSCRIBE') callback(data.payload)
      })
    )
    await socket.connect(httpUrl, token)
    const handler = () => {}
    socket.subscribe(action, type, id, handler)
    socket.subscribe(action, type, id, handler)
    await wait(500)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  describe('if double subscription is allowed', () => {
    beforeEach(() => {
      options.allowDoubleSubscriptions = true
    })

    it('should receive the event one time per subscription', async () => {
      socket = new RealtimeSocket(options)
      socket.connect(httpUrl, token)
      const handler = jest.fn()
      await socket.subscribe(action, type, id, handler)
      await socket.subscribe(action, type, id, handler)
      emit(server, action, type, id, doc)
      await wait(50)
      expect(handler).toBeCalledTimes(2)
    })
  })

  describe('if double subscription is disallowed', () => {
    beforeEach(() => {
      options.allowDoubleSubscriptions = false
    })

    it('should receive the event only one time', async () => {
      socket = new RealtimeSocket(options)
      socket.connect(httpUrl, token)
      const handler = jest.fn()
      await socket.subscribe(action, type, id, handler)
      await socket.subscribe(action, type, id, handler)
      emit(server, action, type, id, doc)
      await wait(50)
      expect(handler).toBeCalledTimes(1)
    })
  })

  describe('if double unsubscription is required', () => {
    beforeEach(() => {
      options.requireDoubleUnsubscriptions = true
    })

    it('should require one unsubscription per subscription', async () => {
      socket = new RealtimeSocket(options)
      socket.connect(httpUrl, token)
      const handler = jest.fn()
      socket.subscribe(action, type, id, handler)
      socket.subscribe(action, type, id, handler)
      await wait(100)
      socket.unsubscribe(action, type, id, handler)
      await wait(100)
      emit(server, action, type, id, doc)
      await wait(100)
      expect(handler).toBeCalledTimes(1)
      socket.unsubscribe(action, type, id, handler)
      await wait(100)
      emit(server, action, type, id, doc)
      await wait(100)
      expect(handler).toBeCalledTimes(1)
    })
  })

  describe('if double unsubscription is not required', () => {
    beforeEach(() => {
      options.requireDoubleUnsubscriptions = false
    })

    it('should remove all similar subscription on the first unsubscribe', async () => {
      socket = new RealtimeSocket(options)
      socket.connect(httpUrl, token)
      const handler = jest.fn()
      socket.subscribe(action, type, id, handler)
      socket.subscribe(action, type, id, handler)
      await wait(100)
      socket.unsubscribe(action, type, id, handler)
      await wait(100)
      emit(server, action, type, id, doc)
      await wait(100)
      expect(handler).toBeCalledTimes(0)
    })
  })
})
