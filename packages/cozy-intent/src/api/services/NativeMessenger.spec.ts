import { NativeMessenger } from './NativeMessenger'
import { mockWebviewRef } from '../../tests/mocks'
import { strings } from '../../api/constants'

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

    nativeMessenger.postMessage('foo')

    expect(mockWebviewRef.injectJavaScript).toBeCalledWith(
      'window.postMessage("foo")'
    )
  })

  it('Should handle onMessage', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    nativeMessenger.addMessageListener(event => {
      nativeMessenger.postMessage(event)
    })

    nativeMessenger.onMessage({ foo: 'bar' })

    expect(mockWebviewRef.injectJavaScript).toBeCalledWith(
      'window.postMessage({"data":{"foo":"bar"}})'
    )
  })

  it('Should throw if no listener is injected', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    expect(() => nativeMessenger.onMessage({ foo: 'bar' })).toThrowError(
      strings.noListenerFound
    )
  })

  it('Should remove listener', () => {
    const nativeMessenger = new NativeMessenger(mockWebviewRef)

    nativeMessenger.addMessageListener(event => {
      nativeMessenger.postMessage(event)
    })()

    expect(() => nativeMessenger.onMessage({ foo: 'bar' })).toThrowError(
      strings.noListenerFound
    )
  })
})
