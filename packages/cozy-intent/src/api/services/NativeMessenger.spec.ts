import { mockWebviewRef } from '../../../tests'
import { NativeMessenger, PostMeMessage } from '../../api'

const mockDebug = jest.fn()

const mockWarn: () => void = jest.fn()

jest.mock('cozy-minilog', () => {
  return {
    __esModule: true,
    default: (): object => ({
      warn: () => mockWarn()
    })
  }
})

jest.mock('post-me', () => ({
  ...jest.requireActual('post-me'),
  debug:
    (nameSpace = 'NativeService') =>
    (): unknown =>
      mockDebug(nameSpace)
}))

describe('NativeMessenger', () => {
  afterEach(() => {
    mockWebviewRef.injectJavaScript.mockClear()
  })

  it('Instantiates with a WebviewRef', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)
    expect(nativeMessenger).toEqual(expect.any(NativeMessenger))
  })

  it('Should handle postMessage', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    nativeMessenger.postMessage({ foo: 'bar' })

    expect(mockWebviewRef.injectJavaScript).toBeCalledWith(
      'window.postMessage({"foo":"bar"})'
    )

    expect(mockWarn).not.toBeCalledWith()
  })

  it('Should handle postMessage with error', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    nativeMessenger.postMessage({ foo: 'bar', error: 'error' })

    expect(mockWebviewRef.injectJavaScript).toBeCalledWith(
      'window.postMessage({"foo":"bar","error":"error"})'
    )

    expect(mockWarn).toBeCalledWith()
  })

  it('Should handle onMessage', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    nativeMessenger.addMessageListener(({ data }) => {
      nativeMessenger.postMessage(data as PostMeMessage)
    })

    nativeMessenger.onMessage({
      action: 'string',
      args: 'string',
      message: 'string',
      methodName: 'string',
      requestId: 0,
      sessionId: 0,
      type: 'string',
      uri: 'string'
    })

    expect(mockWebviewRef.injectJavaScript).toBeCalledWith(
      'window.postMessage({"action":"string","args":"string","message":"string","methodName":"string","requestId":0,"sessionId":0,"type":"string","uri":"string"})'
    )
  })

  it('Should bail out and log if no listener is injected', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    expect(() =>
      nativeMessenger.onMessage({
        action: 'string',
        args: 'string',
        message: 'string',
        methodName: 'string',
        requestId: 0,
        sessionId: 0,
        type: 'string',
        uri: 'string'
      })
    ).not.toThrow()

    expect(mockDebug).toHaveBeenCalled()
  })

  it('Should remove listener', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    nativeMessenger.addMessageListener(({ data }) => {
      nativeMessenger.postMessage(data as PostMeMessage)
    })()

    expect(() =>
      nativeMessenger.onMessage({
        action: 'string',
        args: 'string',
        message: 'string',
        methodName: 'string',
        requestId: 0,
        sessionId: 0,
        type: 'string',
        uri: 'string'
      })
    ).not.toThrow()

    expect(mockDebug).toHaveBeenCalled()
  })
})
