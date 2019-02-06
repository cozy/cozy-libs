import __RewireAPI__, * as cozyRealtime from '../src/index'

const mockConfig = {
  domain: 'cozy.tools:8080',
  secure: false,
  token: 'blablablatoken'
}

describe('(cozy-realtime) cozySocket handling and initCozySocket: ', () => {
  let mockConnect = jest.fn()
  let mockSendSubscribe = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // rewire the internal functions usage
    __RewireAPI__.__Rewire__('createWebSocket', mockConnect)
    __RewireAPI__.__Rewire__('subscribeWhenReady', mockSendSubscribe)
    __RewireAPI__.__Rewire__('cozySocket', {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    })
  })

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('createWebSocket')
    __RewireAPI__.__ResetDependency__('subscribeWhenReady')
    __RewireAPI__.__ResetDependency__('cozySocket')
  })

  it('initCozySocket should call createWebSocket with correct config and arguments', () => {
    // rewire the internal createWebSocket usage
    cozyRealtime.initCozySocket(mockConfig)
    expect(mockConnect.mock.calls.length).toBe(1)
    expect(mockSendSubscribe.mock.calls.length).toBe(0)
    expect(mockConnect.mock.calls[0]).toMatchSnapshot()
  })

  it('initCozySocket should return a configured cozy socket', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    expect(cozySocket).toMatchSnapshot()
  })

  it('cozySocket should not send socket message and add state multiple times if this is the same doctype', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    // we have to keep a reference for each listener for subscribing/unsubscribing
    const mockCreatedListener = jest.fn()
    const mockUpdatedListener = jest.fn()
    const mockDeletedListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.subscribe('io.cozy.mocks', 'updated', mockUpdatedListener)
    cozySocket.subscribe('io.cozy.mocks', 'deleted', mockDeletedListener)
    expect(mockSendSubscribe.mock.calls.length).toBe(1)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    expect(cozyRealtime.getSubscriptionsState()).toMatchSnapshot()
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.unsubscribe('io.cozy.mocks', 'updated', mockUpdatedListener)
    cozySocket.unsubscribe('io.cozy.mocks', 'deleted', mockDeletedListener)
  })

  it('cozySocket should send socket message and add state multiple times if this is the different doctypes', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    // we have to keep a reference for each listener for subscribing/unsubscribing
    const mockCreatedListener = jest.fn()
    const mockUpdatedListener = jest.fn()
    const mockDeletedListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.subscribe('io.cozy.mocks2', 'updated', mockUpdatedListener)
    cozySocket.subscribe('io.cozy.mocks3', 'deleted', mockDeletedListener)
    expect(mockSendSubscribe.mock.calls.length).toBe(3)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(3)
    expect(cozyRealtime.getSubscriptionsState()).toMatchSnapshot()
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.unsubscribe('io.cozy.mocks2', 'updated', mockUpdatedListener)
    cozySocket.unsubscribe('io.cozy.mocks3', 'deleted', mockDeletedListener)
  })

  it('cozySocket should send socket message and add state multiple times if this is different doc ids', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    // we have to keep a reference for each listener for subscribing/unsubscribing
    const mockUpdatedListener = jest.fn()
    const mockUpdatedListener2 = jest.fn()
    cozySocket.subscribe(
      'io.cozy.mocks',
      'updated',
      mockUpdatedListener,
      'id1234'
    )
    cozySocket.subscribe(
      'io.cozy.mocks',
      'updated',
      mockUpdatedListener2,
      'id5678'
    )
    expect(mockSendSubscribe.mock.calls.length).toBe(2)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(2)
    expect(cozyRealtime.getSubscriptionsState()).toMatchSnapshot()
    // reset
    cozySocket.unsubscribe(
      'io.cozy.mocks',
      'updated',
      mockUpdatedListener,
      'id1234'
    )
    cozySocket.unsubscribe(
      'io.cozy.mocks',
      'updated',
      mockUpdatedListener2,
      'id5678'
    )
  })

  it('cozySocket should remove doctype from subscriptions state on unsubscribe', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    // we have to keep a reference for each listener for subscribing/unsubscribing
    const mockCreatedListener = jest.fn()
    const mockUpdatedListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.subscribe(
      'io.cozy.mocks2',
      'updated',
      mockUpdatedListener,
      'id1234'
    )
    expect(mockSendSubscribe.mock.calls.length).toBe(2)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(2)
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.unsubscribe(
      'io.cozy.mocks2',
      'updated',
      mockUpdatedListener,
      'id1234'
    )
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
  })

  it('cozySocket should remove doctype from subscriptions state only if there are no more remaining listeners', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    // we have to keep a reference for each listener for subscribing/unsubscribing
    const mockCreatedListener = jest.fn()
    const mockUpdatedListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.subscribe('io.cozy.mocks', 'updated', mockUpdatedListener)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockCreatedListener)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    cozySocket.unsubscribe('io.cozy.mocks', 'updated', mockUpdatedListener)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
  })

  it('cozySocket should remove doctype from subscriptions state only if it exists', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    // we have to keep a reference for each listener for subscribing/unsubscribing
    const mockCreatedListener = jest.fn()
    const mockUpdatedListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockCreatedListener)
    cozySocket.subscribe('io.cozy.mocks', 'updated', mockUpdatedListener)
    __RewireAPI__.__Rewire__('subscriptionsState', new Set())
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
    expect(() => {
      cozySocket.unsubscribe('io.cozy.mocks', 'created', mockCreatedListener)
      cozySocket.unsubscribe('io.cozy.mocks', 'updated', mockUpdatedListener)
    }).not.toThrowError()
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
    // reset
    __RewireAPI__.__ResetDependency__('subscriptionsState')
  })

  it('cozySocket should not throw any error if we unsubscribe not subscribed doctype', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    // we have to keep a reference for each listener for subscribing/unsubscribing
    const mockCreatedListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'created', mockCreatedListener)
    expect(mockSendSubscribe.mock.calls.length).toBe(1)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    expect(() => {
      cozySocket.unsubscribe('io.cozy.mocks2', 'updated', mockCreatedListener)
    }).not.toThrowError()
    expect(mockSendSubscribe.mock.calls.length).toBe(1)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(1)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockCreatedListener)
  })

  it('cozySocket should throw an error if the listener provided is not a function', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    expect(() => {
      cozySocket.subscribe('io.cozy.mocks', 'updated', 'notAFunction')
    }).toThrowErrorMatchingSnapshot()
    expect(mockSendSubscribe.mock.calls.length).toBe(0)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
  })

  it('cozySocket should throw an error if the socket connexion throwed an error', () => {
    const mockError = new Error('expected socket error')
    const mockConnect = jest.fn(() => {
      throw mockError
    })
    __RewireAPI__.__Rewire__('createWebSocket', mockConnect)
    expect(() => {
      cozyRealtime.initCozySocket(mockConfig)
    }).toThrowError(mockError)
    expect(mockSendSubscribe.mock.calls.length).toBe(0)
    expect(cozyRealtime.getSubscriptionsState().size).toBe(0)
  })

  it('onSocketMessage provided by initCozySocket to createWebSocket should throw error if eventType error', () => {
    cozyRealtime.initCozySocket(mockConfig)
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

  it('onSocketMessage provided by initCozySocket to createWebSocket should call provided listener if matched event received', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      _id: 'mockId',
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
          id: mockDoc._id,
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(1)
    expect(mockListener.mock.calls[0][0]).toEqual(mockDoc)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockListener)
  })

  it('onSocketMessage provided by initCozySocket to createWebSocket should not call provided listener if wrong event received', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      _id: 'mockId',
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
          id: mockDoc._id,
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(0)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockListener)
  })

  it('onSocketMessage provided by initCozySocket to createWebSocket should not call provided listener if wrong doctype received', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      _id: 'mockId',
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
          id: mockDoc._id,
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(0)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockListener)
  })

  it('onSocketMessage provided by initCozySocket to createWebSocket should handle payload wihout id', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      _id: 'mockId',
      name: 'Mock'
    }
    // create listener and add it to a subscription
    const mockListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'updated', mockListener)
    onSocketMessage({
      data: JSON.stringify({
        event: 'UPDATED',
        payload: {
          type: 'io.cozy.mocks',
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(1)
    expect(mockListener.mock.calls[0][0]).toEqual(mockDoc)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'updated', mockListener)
  })

  it('onSocketMessage provided by initCozySocket to createWebSocket should call all listeners with correct docId provided', () => {
    const cozySocket = cozyRealtime.initCozySocket(mockConfig)
    const onSocketMessage = mockConnect.mock.calls[0][1]
    const mockDoc = {
      _id: 'mockId',
      name: 'Mock'
    }
    // create listener and add it to a subscription
    const mockListener = jest.fn()
    const mockDocListener = jest.fn()
    cozySocket.subscribe('io.cozy.mocks', 'updated', mockListener)
    cozySocket.subscribe(
      'io.cozy.mocks',
      'updated',
      mockDocListener,
      mockDoc._id
    )
    onSocketMessage({
      data: JSON.stringify({
        event: 'UPDATED',
        payload: {
          type: 'io.cozy.mocks',
          id: mockDoc._id,
          doc: mockDoc
        }
      })
    })
    expect(mockListener.mock.calls.length).toBe(1)
    expect(mockListener.mock.calls[0][0]).toEqual(mockDoc)
    expect(mockDocListener.mock.calls.length).toBe(1)
    expect(mockDocListener.mock.calls[0][0]).toEqual(mockDoc)
    // reset
    cozySocket.unsubscribe('io.cozy.mocks', 'created', mockListener)
  })

  it('onSocketClose provided by initCozySocket to createWebSocket should do nothing if event.wasClean', () => {
    cozyRealtime.initCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    // reset the mock state to remove the initCozySocket usage
    mockConnect.mockReset()
    onSocketClose({
      wasClean: true
    })
    expect(mockConnect.mock.calls.length).toBe(0)
  })

  it('onSocketClose provided by initCozySocket to createWebSocket should remove the global cozySocket if it exists at the end of retries', () => {
    cozyRealtime.initCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    // reset the mock state to remove the initCozySocket usage
    mockConnect.mockReset()
    console.warn = jest.fn()
    console.error = jest.fn()
    jest.useFakeTimers()
    onSocketClose(
      {
        wasClean: false,
        code: 0
      },
      1,
      100
    )
    expect(console.warn.mock.calls.length).toBe(2)
    expect(console.error.mock.calls.length).toBe(0)
    console.warn.mockClear()
    console.error.mockClear()
    expect(cozyRealtime.getCozySocket()).toBeInstanceOf(Object)
    jest.runAllTimers()
    onSocketClose({
      wasClean: false,
      code: 0,
      reason: 'expected test close reason'
    })
    jest.runAllTimers()
    expect(cozyRealtime.getCozySocket()).toBeNull()
    expect(mockConnect.mock.calls.length).toBe(1)
    // 2 warns each
    expect(console.warn.mock.calls.length).toBe(1)
    expect(console.error.mock.calls.length).toBe(1)
    console.warn.mockRestore()
    console.error.mockRestore()
  })

  it('onSocketClose provided by initCozySocket to createWebSocket should just warn if !event.wasClean without retries provided', () => {
    cozyRealtime.initCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    // reset the mock state to remove the initCozySocket usage
    mockConnect.mockReset()
    console.warn = jest.fn()
    console.error = jest.fn()
    onSocketClose({
      wasClean: false,
      code: 0
    })
    expect(console.warn.mock.calls.length).toBe(1)
    expect(console.error.mock.calls.length).toBe(1)
    console.warn.mockClear()
    console.error.mockClear()
    onSocketClose({
      wasClean: false,
      code: 0,
      reason: 'expected test close reason'
    })
    expect(console.warn.mock.calls.length).toBe(1)
    expect(console.error.mock.calls.length).toBe(1)
    expect(mockConnect.mock.calls.length).toBe(0)
    console.warn.mockRestore()
    console.error.mockRestore()
  })

  it('onSocketClose provided by initCozySocket to createWebSocket should retry according to retries provided and !event.wasClean', () => {
    const RETRIES = 2
    cozyRealtime.initCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    let numRetries = RETRIES
    // reset the mock state to remove the initCozySocket usage
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
    // since we have 2 retries here, it shouldn't call createWebSocket
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

  it('onSocketClose provided by initCozySocket to createWebSocket should handle error from a retry createWebSocket with an error message', () => {
    const mockError = new Error('expected socket retry error')
    cozyRealtime.initCozySocket(mockConfig)
    const onSocketClose = mockConnect.mock.calls[0][2]
    // reset the mock state to remove the initCozySocket usage
    const mockConnectWithError = jest.fn(() => {
      throw mockError
    })
    __RewireAPI__.__Rewire__('createWebSocket', mockConnectWithError)
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
})
