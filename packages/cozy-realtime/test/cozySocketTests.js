import __RewireAPI__, * as cozyRealtime from '../src/index'

const mockConfig = {
  domain: 'cozy.tools:8080',
  secure: false,
  token: 'blablablatoken'
}

export default () => {
  let mockConnect = jest.fn()
  let mockSendSubscribe = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
    // rewire the internal functions usage
    __RewireAPI__.__Rewire__('connectWebSocket', mockConnect)
    __RewireAPI__.__Rewire__('subscribeWhenReady', mockSendSubscribe)
  })

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('connectWebSocket')
    __RewireAPI__.__ResetDependency__('subscribeWhenReady')
  })

  it('getCozySocket should call connectWebSocket with correct config and arguments', async () => {
    // rewire the internal connectWebSocket usage
    cozyRealtime.getCozySocket(mockConfig)
    expect(mockConnect.mock.calls.length).toBe(1)
    expect(mockSendSubscribe.mock.calls.length).toBe(0)
    expect(mockConnect.mock.calls[0]).toMatchSnapshot()
  })

  it('getCozySocket should return a configured cozy socket', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    expect(cozySocket).toMatchSnapshot()
  })

  it('cozySocket should not send socket message and add state multiple times if this is the same doctype', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    cozySocket.subscribe('io.cozy.mocks', 'created', jest.fn)
    cozySocket.subscribe('io.cozy.mocks', 'updated', jest.fn)
    cozySocket.subscribe('io.cozy.mocks', 'deleted', jest.fn)
    expect(mockSendSubscribe.mock.calls.length).toBe(1)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    expect(cozyRealtime.getSubscriptionsState()).toMatchSnapshot()
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', jest.fn)
    cozySocket.unsubscribe('io.cozy.mocks', 'updated', jest.fn)
    cozySocket.unsubscribe('io.cozy.mocks', 'deleted', jest.fn)
  })

  it('cozySocket should send socket message and add state multiple times if this is the different doctypes', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    cozySocket.subscribe('io.cozy.mocks', 'created', jest.fn)
    cozySocket.subscribe('io.cozy.mocks2', 'updated', jest.fn)
    cozySocket.subscribe('io.cozy.mocks3', 'deleted', jest.fn)
    expect(mockSendSubscribe.mock.calls.length).toBe(3)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(3)
    expect(cozyRealtime.getSubscriptionsState()).toMatchSnapshot()
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', jest.fn)
    cozySocket.unsubscribe('io.cozy.mocks2', 'updated', jest.fn)
    cozySocket.unsubscribe('io.cozy.mocks3', 'deleted', jest.fn)
  })

  it('cozySocket should remove doctype from subscriptions state on unsubscribe', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    cozySocket.subscribe('io.cozy.mocks', 'created', jest.fn)
    cozySocket.subscribe('io.cozy.mocks2', 'updated', jest.fn)
    expect(mockSendSubscribe.mock.calls.length).toBe(2)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(2)
    cozySocket.unsubscribe('io.cozy.mocks', 'created', jest.fn)
    cozySocket.unsubscribe('io.cozy.mocks2', 'updated', jest.fn)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
  })

  it('cozySocket should not throw any error if we unsubscribe not subscribed doctype', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    cozySocket.subscribe('io.cozy.mocks', 'created', jest.fn)
    expect(mockSendSubscribe.mock.calls.length).toBe(1)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    expect(() => {
      cozySocket.unsubscribe('io.cozy.mocks2', 'updated', jest.fn)
    }).not.toThrowError()
    expect(mockSendSubscribe.mock.calls.length).toBe(1)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', jest.fn)
  })

  it('cozySocket should throw an error if the listener provided is not a function', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    expect(() => {
      cozySocket.subscribe('io.cozy.mocks', 'updated', 'notAFunction')
    }).toThrowErrorMatchingSnapshot()
    expect(mockSendSubscribe.mock.calls.length).toBe(0)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
  })

  it('cozySocket should reject an error if the socket connexion throwed an error', async () => {
    const mockError = new Error('expected socket error')
    const mockConnect = jest.fn(() => {
      throw mockError
    })
    __RewireAPI__.__Rewire__('connectWebSocket', mockConnect)
    await expect(cozyRealtime.getCozySocket(mockConfig)).rejects.toBe(mockError)
    expect(mockSendSubscribe.mock.calls.length).toBe(0)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
  })

  it('onSocketMessage provided by getCozySocket to connectWebSocket should throw error if eventType error', async () => {
    await cozyRealtime.getCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    expect(() => {
      onSocketMessage({
        data: JSON.stringify({
          event: 'ERROR',
          payload: {
            title: 'expected realtime error'
          }
        })
      })
    }).toThrowErrorMatchingSnapshot()
  })

  it('onSocketMessage provided by getCozySocket to connectWebSocket should call provided listener if matched event received', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      id: 'mockId',
      name: 'Mock'
    }
    // create listener and add it to a subscription
    const mockListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockListener)
    onSocketMessage({
      data: JSON.stringify({
        event: 'CREATED',
        payload: {
          type: 'io.cozy.mocks',
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(1)
    expect(mockListener.mock.calls[0][0]).toEqual(mockDoc)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockListener)
  })

  it('onSocketMessage provided by getCozySocket to connectWebSocket should not call provided listener if wrong event received', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      id: 'mockId',
      name: 'Mock'
    }
    // create listener and add it to a subscription
    const mockListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockListener)
    onSocketMessage({
      data: JSON.stringify({
        event: 'DELETED',
        payload: {
          type: 'io.cozy.mocks',
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(0)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockListener)
  })

  it('onSocketMessage provided by getCozySocket to connectWebSocket should not call provided listener if wrong doctype received', async () => {
    const cozySocket = await cozyRealtime.getCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      id: 'mockId',
      name: 'Mock'
    }
    // create listener and add it to a subscription
    const mockListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockListener)
    onSocketMessage({
      data: JSON.stringify({
        event: 'CREATED',
        payload: {
          type: 'io.cozy.mocks2',
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(0)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockListener)
  })

  it('onSocketClose provided by getCozySocket to connectWebSocket should do nothing if event.wasClean', async () => {
    await cozyRealtime.getCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    // reset the mock state to remove the getCozySocket usage
    mockConnect.mockReset()
    onSocketClose({
      wasClean: true
    })
    expect(mockConnect.mock.calls.length).toBe(0)
  })

  it('onSocketClose provided by getCozySocket to connectWebSocket should just warn if !event.wasClean without retries provided', async () => {
    await cozyRealtime.getCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    // reset the mock state to remove the getCozySocket usage
    mockConnect.mockReset()
    console.warn = jest.fn()
    onSocketClose({
      wasClean: false,
      code: 0
    })
    onSocketClose({
      wasClean: false,
      code: 0,
      reason: 'expected test close reason'
    })
    expect(console.warn.mock.calls.length).toBe(2)
    expect(mockConnect.mock.calls.length).toBe(0)
    console.warn.mockRestore()
  })

  it('onSocketClose provided by getCozySocket to connectWebSocket should retry according to retries provided and !event.wasClean', async () => {
    const RETRIES = 2
    await cozyRealtime.getCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    let numRetries = RETRIES
    // reset the mock state to remove the getCozySocket usage
    mockConnect.mockReset()
    jest.useFakeTimers()
    onSocketClose(
      {
        wasClean: false,
        code: 0,
        reason: 'expected test close reason'
      },
      numRetries,
      200
    )
    jest.runAllTimers()
    const onSocketClose2 = mockConnect.mock.calls[0][2]
    numRetries--
    onSocketClose2(
      {
        wasClean: false,
        code: 0,
        reason: 'expected test close reason'
      },
      numRetries,
      200
    )
    jest.runAllTimers()
    // since we have 2 retries here, it shouldn't call connectWebSocket
    // after this next socket closing
    const onSocketClose3 = mockConnect.mock.calls[0][2]
    numRetries--
    onSocketClose3(
      {
        wasClean: false,
        code: 0,
        reason: 'expected test close reason'
      },
      numRetries,
      200
    )
    jest.runAllTimers()
    expect(mockConnect.mock.calls.length).toBe(RETRIES)
  })

  it('onSocketClose provided by getCozySocket to connectWebSocket should handle error from a retry connectWebSocket with an error message', async () => {
    const mockError = new Error('expected socket retry error')
    await cozyRealtime.getCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    // reset the mock state to remove the getCozySocket usage
    const mockConnectWithError = jest.fn(() => {
      throw mockError
    })
    __RewireAPI__.__Rewire__('connectWebSocket', mockConnectWithError)
    jest.useFakeTimers()
    console.error = jest.fn()
    expect(() => {
      onSocketClose(
        {
          wasClean: false,
          code: 0,
          reason: 'expected test close reason'
        },
        1,
        200
      )
    }).not.toThrowError()
    jest.runAllTimers()
    expect(mockConnect.mock.calls.length).toBe(1)
    expect(console.error.mock.calls.length).toBe(1)
    expect(console.error.mock.calls[0][0]).toMatchSnapshot()
    console.error.mockRestore()
  })
}
