import { ParentHandshake } from 'post-me'

import {
  NativeMessenger,
  NativeMethodsRegister,
  NativeService,
  ParsedNativeEvent,
  WebviewRef,
  strings
} from '../../api'
import { interpolate } from '../../utils'
import { mockNativeMethods } from '../../../tests'

jest.mock('post-me', () => ({
  ParentHandshake: jest.fn(() => Promise.resolve({ foo: 'bar' }))
}))

jest.mock('../services/NativeMessenger')

const onMessageMock = jest.fn()
class MockNativeMessenger extends NativeMessenger {
  constructor(webviewRef: WebviewRef) {
    super(webviewRef)
  }

  public postMessage = jest.fn()

  public addMessageListener = jest.fn()

  public onMessage = (event: ParsedNativeEvent): void => {
    onMessageMock(event)
  }
}

describe('NativeService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should allow to register and unregister webviews', async () => {
    const nativeMethods: NativeMethodsRegister = {
      backToHome: jest.fn(),
      logout: jest.fn(),
      openApp: jest.fn(),
      hideSplashScreen: jest.fn(),
      setFlagshipUI: jest.fn(),
      showSplashScreen: jest.fn()
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

    expect(onMessageMock).toHaveBeenNthCalledWith(1, { source: 'post-me' })

    nativeService.unregisterWebview(webviewRef)

    await expect(
      nativeService.tryEmit({
        nativeEvent: { data: '{"source": "post-me"}', url: 'http://SOME_URI' }
      })
    ).rejects.toThrow(
      `Cannot emit message. No webview is registered with uri: some_uri`
    )
  })

  describe('registerWebview', () => {
    it('Should allow to register a webview', () => {
      const nativeMethods: NativeMethodsRegister = {
        backToHome: jest.fn(),
        logout: jest.fn(),
        openApp: jest.fn(),
        hideSplashScreen: jest.fn(),
        setFlagshipUI: jest.fn(),
        showSplashScreen: jest.fn()
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
        backToHome: jest.fn(),
        logout: jest.fn(),
        openApp: jest.fn(),
        hideSplashScreen: jest.fn(),
        setFlagshipUI: jest.fn(),
        showSplashScreen: jest.fn()
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
        backToHome: jest.fn(),
        logout: jest.fn(),
        openApp: jest.fn(),
        hideSplashScreen: jest.fn(),
        setFlagshipUI: jest.fn(),
        showSplashScreen: jest.fn()
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

  describe('TryEmit', () => {
    const nativeService = new NativeService(
      mockNativeMethods,
      MockNativeMessenger
    )

    it('Should do nothing on non post-me messages', async () => {
      await nativeService.tryEmit({
        nativeEvent: { data: '{"not":"postme"}', url: '//bar' }
      })

      expect(onMessageMock).not.toHaveBeenCalled()
    })

    it('Should try to init a webview', async () => {
      nativeService.registerWebview({
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://bar.com'
          }
        }
      })

      await nativeService.tryEmit({
        nativeEvent: {
          data: `{"go":"post-me", "message": "${strings.webviewIsRendered}", "uri": "http://bar.com"}`,
          url: 'http://bar.com'
        }
      })

      expect(ParentHandshake).toHaveBeenCalledTimes(1)
    })

    it('Should throw when init an existing webview', async () => {
      await expect(
        nativeService.tryEmit({
          nativeEvent: {
            data: `{"go":"post-me", "message": "${strings.webviewIsRendered}", "uri": "http://bar.com"}`,
            url: 'http://bar.com'
          }
        })
      ).rejects.toThrow(
        interpolate(strings.errorInitWebview, { uri: 'bar.com' })
      )
    })
  })
})
