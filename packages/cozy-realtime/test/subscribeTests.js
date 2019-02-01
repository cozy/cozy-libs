import __RewireAPI__, { subscribeWhenReady } from '../src/index'

let mockSubscribe
export default () => {
  beforeEach(() => {
    mockSubscribe = jest.fn(subscribeWhenReady)
    __RewireAPI__.__Rewire__('subscribeWhenReady', mockSubscribe)
  })

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('subscribeWhenReady')
  })

  it('subscribeWhenReady should retries a provided max number times if socket not opened', async () => {
    const maxRetries = 10
    const mockSocket = {
      readyState: 0, // code CONNECTING !== OPEN (code 0)
      send: jest.fn()
    }
    jest.useFakeTimers()
    mockSubscribe('io.cozy.mocks', mockSocket, maxRetries)
    // we run pending timers for a number less one
    Array.apply(null, { length: maxRetries - 1 }).forEach(() => {
      jest.runOnlyPendingTimers()
    })
    // we change socket state for the last try
    mockSocket.readyState = 1
    jest.runOnlyPendingTimers()
    // excessive run to be sure we don't have timeout anymore
    jest.runOnlyPendingTimers()
    jest.runOnlyPendingTimers()
    // maxRetries + the first subscribeWhenReady call
    expect(mockSubscribe.mock.calls.length).toBe(maxRetries + 1)
  })

  it('subscribeWhenReady should retries a provided max number times and throw error if still not opened', async () => {
    const maxRetries = 10
    const mockSocket = {
      readyState: 0, // code CONNECTING !== OPEN (code 0)
      send: jest.fn()
    }
    jest.useFakeTimers()
    expect(() => {
      mockSubscribe('io.cozy.mocks', mockSocket, maxRetries)
      // we run pending timers for all retries
      Array.apply(null, { length: maxRetries }).forEach(() => {
        jest.runOnlyPendingTimers()
      })
    }).toThrowErrorMatchingSnapshot()
    // maxRetries + the first subscribeWhenReady call
    expect(mockSubscribe.mock.calls.length).toBe(maxRetries + 1)
  })

  it('subscribeWhenReady should send the correct socket message if socket opened', async () => {
    const maxRetries = 10
    const mockSocket = {
      readyState: 1,
      send: jest.fn()
    }
    jest.useFakeTimers()
    expect(() => {
      mockSubscribe('io.cozy.mocks', mockSocket, maxRetries)
      // we run pending timers for all retries
      Array.apply(null, { length: maxRetries }).forEach(() => {
        jest.runOnlyPendingTimers()
      })
    }).not.toThrowError()
    expect(mockSubscribe.mock.calls.length).toBe(1)
    expect(JSON.parse(mockSocket.send.mock.calls[0][0])).toMatchSnapshot()
  })

  it('subscribeWhenReady should throw error + warn if message sent with error', async () => {
    const maxRetries = 10
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
      mockSubscribe('io.cozy.mocks', mockSocket, maxRetries)
      // we run pending timers for all retries
      Array.apply(null, { length: maxRetries }).forEach(() => {
        jest.runOnlyPendingTimers()
      })
    }).toThrowError(sendError)
    expect(mockSubscribe.mock.calls.length).toBe(1)
    expect(console.warn.mock.calls.length).toBe(1)
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot()
    console.warn.mockRestore()
  })
}
