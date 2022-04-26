import { NativeMessenger, PostMeMessage } from '../../api'
import { mockWebviewRef } from '../../../tests'

const mockDebug = jest.fn()

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
