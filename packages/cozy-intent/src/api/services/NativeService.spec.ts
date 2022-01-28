import { WebviewRef } from '../models/environments'
import { NativeEvent } from '../models/events'
import { NativeMethodsRegister } from '../models/methods'
import { NativeMessenger } from '../services/NativeMessenger'
import { NativeService } from './NativeService'

jest.mock('../services/NativeMessenger')

const onMessageMock = jest.fn()
class MockNativeMessenger extends NativeMessenger {
  constructor(webviewRef: WebviewRef) {
    super(webviewRef)
  }

  public postMessage = jest.fn()

  public addMessageListener = jest.fn()

  public onMessage = (event: NativeEvent): void => {
    onMessageMock(event)
  }
}

describe('NativeMessenger', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should allow to register and unregister webviews', async () => {
    const nativeMethods: NativeMethodsRegister = {
      logout: jest.fn(),
      openApp: jest.fn()
    }

    const webviewRef: WebviewRef = {
      injectJavaScript: jest.fn(),
      props: {
        source: {
          uri: 'http://SOME_URI'
        }
      }
    }

    const nativeService = new NativeService(nativeMethods, MockNativeMessenger)

    nativeService.registerWebview(webviewRef)

    await nativeService.tryEmit({
      nativeEvent: { data: '{"source": "post-me"}', url: 'http://SOME_URI' }
    })

    expect(onMessageMock).toHaveBeenNthCalledWith(1, {
      nativeEvent: { data: '{"source": "post-me"}', url: 'http://SOME_URI' }
    })

    nativeService.unregisterWebview(webviewRef)

    await expect(
      nativeService.tryEmit({
        nativeEvent: { data: '{"source": "post-me"}', url: 'http://SOME_URI' }
      })
    ).rejects.toThrow()
  })

  describe('registerWebview', () => {
    it('Should allow to register a webview', () => {
      const nativeMethods: NativeMethodsRegister = {
        logout: jest.fn(),
        openApp: jest.fn()
      }

      const webviewRef: WebviewRef = {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://SOME_URI'
          }
        }
      }

      const nativeService = new NativeService(nativeMethods)

      nativeService.registerWebview(webviewRef)

      expect(NativeMessenger).toHaveBeenNthCalledWith(1, webviewRef)
    })

    it('Should throw if registering two times the same webview', () => {
      const nativeMethods: NativeMethodsRegister = {
        logout: jest.fn(),
        openApp: jest.fn()
      }

      const webviewRef: WebviewRef = {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://SOME_URI'
          }
        }
      }

      const nativeService = new NativeService(nativeMethods)

      nativeService.registerWebview(webviewRef)

      expect(() => {
        nativeService.registerWebview(webviewRef)
      }).toThrow(
        'Cannot register webview. A webview is already registered into cozy-intent with the uri: some_uri'
      )
    })
  })

  describe('unregisterWebview', () => {
    it('Should throw if unregistering not registered webview', () => {
      const nativeMethods: NativeMethodsRegister = {
        logout: jest.fn(),
        openApp: jest.fn()
      }

      const webviewRef: WebviewRef = {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://SOME_URI'
          }
        }
      }

      const nativeService = new NativeService(nativeMethods)

      expect(() => {
        nativeService.unregisterWebview(webviewRef)
      }).toThrow(
        'Cannot unregister webview. No webview is registered into cozy-intent with the uri: some_uri'
      )
    })
  })
})
