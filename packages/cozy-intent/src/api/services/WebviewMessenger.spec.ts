import { mockWebviewRef, mockWebviewWindow } from '../../../tests'
import { WebviewMessenger } from '../../api'

describe('WebviewMessenger', () => {
  afterEach(() => {
    mockWebviewRef.injectJavaScript.mockClear()
  })

  it('Instantiates with a WebviewRef', () => {
    const webviewMessenger = new WebviewMessenger(mockWebviewWindow())
    expect(webviewMessenger).toEqual(expect.any(WebviewMessenger))
  })

  it('Should handle postMessage', () => {
    const mockWindow = mockWebviewWindow()
    const webviewMessenger = new WebviewMessenger(mockWindow)

    webviewMessenger.postMessage({ foo: 'bar' })

    expect(mockWindow.ReactNativeWebView.postMessage).toBeCalledWith(
      '{"foo":"bar"}'
    )
  })

  it('Should handle addMessageListener', async () => {
    expect.assertions(1)

    const mockWindow = mockWebviewWindow()
    const webviewMessenger = new WebviewMessenger(mockWindow)
    const mockListener = jest.fn()

    webviewMessenger.addMessageListener(mockListener)

    mockWindow.postMessage('*', '*')

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockListener).toHaveBeenCalled()
  })

  it('Should remove addMessageListener', async () => {
    expect.assertions(1)

    const mockWindow = mockWebviewWindow()
    const webviewMessenger = new WebviewMessenger(mockWindow)
    const mockListener = jest.fn()

    webviewMessenger.addMessageListener(mockListener)()

    mockWindow.postMessage('*', '*')

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockListener).not.toHaveBeenCalled()
  })
})
