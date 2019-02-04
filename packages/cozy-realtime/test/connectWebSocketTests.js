import { Server } from 'mock-socket'

import __RewireAPI__, { connectWebSocket, getCozySocket } from '../src/index'

const MOCK_SERVER_DOMAIN = 'localhost:8880'

const REALTIME_URL = `ws://${MOCK_SERVER_DOMAIN}/realtime/`

// const mockServer = new Server(`ws://${MOCK_SERVER_DOMAIN}/realtime/`)

let mockSubscribe
let server
export default () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockSubscribe = jest.fn()
    __RewireAPI__.__Rewire__('subscribeWhenReady', mockSubscribe)
    server = new Server(REALTIME_URL)
    server.on('connection', socket => {
      socket.on('message', () => {})
      socket.send('message')
      socket.close()
    })
  })

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('subscribeWhenReady')
    server.stop()
  })

  it('socket should create and return a cozySocket with provided domain and secure option', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }

    const cozySocket = connectWebSocket(
      mockConfig,
      jest.fn(),
      jest.fn(),
      10,
      2000
    )
    setTimeout(() => {
      expect(cozySocket).toMatchSnapshot()
    }, 100)
  })

  it('socket should create and return a cozySocket handling wss', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: true,
      token: 'blablablatoken'
    }

    const cozySocket = connectWebSocket(
      mockConfig,
      jest.fn(),
      jest.fn(),
      10,
      2000
    )
    expect(cozySocket).toMatchSnapshot()
  })

  it('socket should throw error if no url or domain provided', () => {
    const mockConfig = {
      secure: false,
      token: 'blablablatoken'
    }

    expect(() => {
      connectWebSocket(mockConfig, jest.fn(), jest.fn(), 10, 2000)
    }).toThrowErrorMatchingSnapshot()
  })

  it('socket should throw error if wrong url format provided', () => {
    const mockConfig = {
      url: 'blable.bla:blabla',
      secure: false,
      token: 'blablablatoken'
    }

    expect(() => {
      connectWebSocket(mockConfig, jest.fn(), jest.fn(), 10, 2000)
    }).toThrowErrorMatchingSnapshot()
  })

  it('socket should throw error if wrong url type provided', () => {
    const mockConfig = {
      url: () => {},
      secure: false,
      token: 'blablablatoken'
    }

    expect(() => {
      connectWebSocket(mockConfig, jest.fn(), jest.fn(), 10, 2000)
    }).toThrowErrorMatchingSnapshot()
  })

  it('socket should handle authenticating on socket open', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }

    const cozySocket = connectWebSocket(
      mockConfig,
      jest.fn(),
      jest.fn(),
      10,
      2000
    )
    cozySocket.send = jest.fn()
    // simulate onopen
    cozySocket.onopen[0]()
    expect(cozySocket.send.mock.calls.length).toBe(1)
    expect(JSON.parse(cozySocket.send.mock.calls[0][0]).payload).toBe(
      mockConfig.token
    )
    expect(JSON.parse(cozySocket.send.mock.calls[0][0])).toMatchSnapshot()
  })

  it('socket should throw error if authenticating goes wrong', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }
    const authError = new Error('Expected auth error')

    const cozySocket = connectWebSocket(
      mockConfig,
      jest.fn(),
      jest.fn(),
      10,
      2000
    )
    cozySocket.send = jest.fn(() => {
      throw authError
    })
    // simulate onopen
    expect(() => {
      cozySocket.onopen[0]()
    }).toThrowError(authError)
    expect(cozySocket.send.mock.calls.length).toBe(1)
    expect(JSON.parse(cozySocket.send.mock.calls[0][0]).payload).toBe(
      mockConfig.token
    )
  })

  it('socket should warn errors on socket errors', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }
    console.error = jest.fn()

    connectWebSocket(mockConfig, jest.fn(), jest.fn(), 10, 2000)
    // simulate onerror
    expect(() => {
      server.simulate('error')
    }).not.toThrowError()
    expect(console.error.mock.calls.length).toBe(1)
    expect(console.error.mock.calls[0][0]).toMatchSnapshot()
    console.error.mockRestore()
  })

  it('socket should handle message', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }
    const onMessageMock = jest.fn()

    connectWebSocket(mockConfig, onMessageMock, jest.fn(), 10, 2000)
    // simulate a message
    server.emit('message', 'a server message to socket')
    expect(onMessageMock.mock.calls.length).toBe(1)
    onMessageMock.mock.calls[0][0].timeStamp = 0 // reset timestamp for snapshot
    expect(onMessageMock.mock.calls[0][0]).toMatchSnapshot()
  })

  it('socket should handle closing server', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }
    const onCloseMock = jest.fn()
    jest.spyOn(window, 'removeEventListener')

    connectWebSocket(mockConfig, jest.fn(), onCloseMock, 10, 2000)
    server.close()
    expect(onCloseMock.mock.calls.length).toBe(1)
    expect(window.removeEventListener.mock.calls.length).toBe(1)
    onCloseMock.mock.calls[0][0].timeStamp = 0 // reset timestamp for snapshot
    expect(onCloseMock.mock.calls[0][0]).toMatchSnapshot()
  })

  it('socket should handle closing server even if no onclose function provided', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }

    connectWebSocket(mockConfig, jest.fn(), null, 10, 2000)
    server.close()
    expect(window.removeEventListener.mock.calls.length).toBe(1)
  })

  it('socket should close the socket on unloading window', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }

    const cozySocket = connectWebSocket(
      mockConfig,
      jest.fn(),
      jest.fn(),
      10,
      2000
    )
    cozySocket.close = jest.fn()
    window.dispatchEvent(new Event('beforeunload'))
    expect(cozySocket.close.mock.calls.length).toBe(1)
  })

  it('socket should send doctype subscriptions again if this is a retry and if there are subscriptionsState', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }

    // add subscriptions to subscriptionsState
    __RewireAPI__.__Rewire__(
      'subscriptionsState',
      new Set(['io.cozy.mocks', 'io.cozy.mocks2'])
    )

    connectWebSocket(mockConfig, jest.fn(), jest.fn(), 10, 2000, true)
    expect(mockSubscribe.mock.calls.length).toBe(2)

    // reset
    __RewireAPI__.__ResetDependency__('subscriptionsState')
  })

  it('socket should not send doctype subscriptions again if this is a retry but subscriptionsState is empty', () => {
    const mockConfig = {
      domain: MOCK_SERVER_DOMAIN,
      secure: false,
      token: 'blablablatoken'
    }

    connectWebSocket(mockConfig, jest.fn(), jest.fn(), 10, 2000, true)
    expect(mockSubscribe.mock.calls.length).toBe(0)
  })
}
