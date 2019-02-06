import __RewireAPI__, { subscribeWhenReady } from '../src/index'

let mockSubscribe = jest.fn(subscribeWhenReady)
const MAX_RETRIES = 10 // decrease the max retries for the test

describe('(cozy-realtime) subscribeWhenReady: ', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    __RewireAPI__.__Rewire__('subscribeWhenReady', mockSubscribe)
    __RewireAPI__.__Rewire__('MAX_SOCKET_POLLS', MAX_RETRIES)
  })

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('subscribeWhenReady')
    __RewireAPI__.__ResetDependency__('MAX_SOCKET_POLLS')
  })

  it('should retries a provided max number times if socket not opened', () => {
    let mockSocket = {
      readyState: 0, // code CONNECTING !== OPEN (code 0)
      send: jest.fn()
    }
    jest.useFakeTimers()
    mockSubscribe(mockSocket, 'io.cozy.mocks')
    // we run pending timers for a number less one
    Array.apply(null, { length: MAX_RETRIES - 1 }).forEach(() => {
      jest.runOnlyPendingTimers()
    })
    // we change socket state for the last try
    mockSocket.readyState = 1
    jest.runOnlyPendingTimers()
    // excessive run to be sure we don't have timeout anymore
    jest.runOnlyPendingTimers()
    jest.runOnlyPendingTimers()
    // maxRetries + the first subscribeWhenReady call
    expect(mockSubscribe.mock.calls.length).toBe(MAX_RETRIES + 1)

    // with doc id provided
    mockSubscribe.mockClear()
    mockSocket = {
      readyState: 0, // code CONNECTING !== OPEN (code 0)
      send: jest.fn()
    }
    jest.useFakeTimers()
    mockSubscribe(mockSocket, 'io.cozy.mocks', 'id1234')
    // we run pending timers for a number less one
    Array.apply(null, { length: MAX_RETRIES - 1 }).forEach(() => {
      jest.runOnlyPendingTimers()
    })
    // we change socket state for the last try
    mockSocket.readyState = 1
    jest.runOnlyPendingTimers()
    // excessive run to be sure we don't have timeout anymore
    jest.runOnlyPendingTimers()
    jest.runOnlyPendingTimers()
    // maxRetries + the first subscribeWhenReady call
    expect(mockSubscribe.mock.calls.length).toBe(MAX_RETRIES + 1)
  })

  it('should retries a provided max number times and throw error + warn if still not opened', () => {
    const maxRetries = MAX_RETRIES + 2
    const mockSocket = {
      readyState: 0, // code CONNECTING !== OPEN (code 0)
      send: jest.fn()
    }
    jest.useFakeTimers()
    console.warn = jest.fn()
    expect(() => {
      mockSubscribe(mockSocket, 'io.cozy.mocks', null, maxRetries)
      // we run pending timers for all retries
      Array.apply(null, { length: maxRetries }).forEach(() => {
        jest.runOnlyPendingTimers()
      })
    }).toThrowErrorMatchingSnapshot()
    // maxRetries + the first subscribeWhenReady call
    expect(mockSubscribe.mock.calls.length).toBe(maxRetries + 1)
    expect(console.warn.mock.calls.length).toBe(1)
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot()
    console.warn.mockRestore()
  })

  it('should send the correct socket message if socket opened', () => {
    const mockSocket = {
      readyState: 1,
      send: jest.fn()
    }
    jest.useFakeTimers()
    expect(() => {
      mockSubscribe(mockSocket, 'io.cozy.mocks')
      // we run pending timers for all retries
      Array.apply(null, { length: MAX_RETRIES }).forEach(() => {
        jest.runOnlyPendingTimers()
      })
    }).not.toThrowError()
    expect(mockSubscribe.mock.calls.length).toBe(1)
    expect(JSON.parse(mockSocket.send.mock.calls[0][0])).toMatchSnapshot()
  })

  it('should send the correct socket message if socket opened with docId provided', () => {
    const mockSocket = {
      readyState: 1,
      send: jest.fn()
    }
    jest.useFakeTimers()
    expect(() => {
      mockSubscribe(mockSocket, 'io.cozy.mocks', 'id1234')
      // we run pending timers for all retries
      Array.apply(null, { length: MAX_RETRIES }).forEach(() => {
        jest.runOnlyPendingTimers()
      })
    }).not.toThrowError()
    expect(mockSubscribe.mock.calls.length).toBe(1)
    expect(JSON.parse(mockSocket.send.mock.calls[0][0])).toMatchSnapshot()
  })

  it('should throw error + warn if message sent with error', () => {
    const sendError = new Error('expected socket send error')
    const mockSocket = {
      readyState: 1,
      send: jest.fn(() => {
        throw sendError
      })
    }
    jest.useFakeTimers()
    console.warn = jest.fn()
    expect(() => {
      mockSubscribe(mockSocket, 'io.cozy.mocks')
      // we run pending timers for all retries
      Array.apply(null, { length: MAX_RETRIES }).forEach(() => {
        jest.runOnlyPendingTimers()
      })
    }).toThrowError(sendError)
    expect(mockSubscribe.mock.calls.length).toBe(1)
    expect(console.warn.mock.calls.length).toBe(1)
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot()
    console.warn.mockRestore()
  })
})
