import { ParentHandshake } from 'post-me'

import { mockNativeMethods } from '../../../tests'
import {
  NativeMessenger,
  NativeMethodsRegister,
  NativeService,
  PostMeMessage,
  WebviewRef,
  strings
} from '../../api'

const mockDebug = jest.fn()

const onMessageMock = jest.fn()

class MockNativeMessenger extends NativeMessenger {
  constructor(webviewRef: WebviewRef) {
    super(webviewRef)
  }

  public postMessage = jest.fn()

  public addMessageListener = jest.fn()

  public onMessage = (event: PostMeMessage): void => {
    onMessageMock(event)
  }
}

jest.mock('post-me', () => ({
  ...jest.requireActual('post-me'),
  debug:
    (nameSpace = 'NativeService') =>
    (): unknown =>
      mockDebug(nameSpace),
  ParentHandshake: jest.fn(() => Promise.resolve({ foo: 'bar' }))
}))

jest.mock('../services/NativeMessenger')

describe('NativeService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should allow to register and unregister webviews, regardless of casing', async () => {
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
      nativeEvent: { data: '{"type":"@post-me"}', url: 'http://some_uri' }
    })

    expect(onMessageMock).toHaveBeenNthCalledWith(1, { type: '@post-me' })

    nativeService.unregisterWebview(webviewRef)

    await expect(
      nativeService.tryEmit({
        nativeEvent: { data: '{"type":"@post-me"}', url: 'http://some_uri' }
      })
    ).resolves.not.toThrow()

    expect(mockDebug).toHaveBeenCalled()
    expect(onMessageMock).toHaveBeenCalledTimes(1)
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

    it('Should bail out and log if registering two times the same webview', () => {
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
      }).not.toThrow()

      expect(mockDebug).toHaveBeenCalled()
    })

    it('Should allow to register a webview with a baseUrl instead of an uri', () => {
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
            html: 'SOME HTML',
            baseUrl: 'http://SOME_BASE_URL'
          }
        }
      }

      const nativeService = new NativeService(nativeMethods)

      nativeService.registerWebview(webviewRef)

      expect(NativeMessenger).toHaveBeenNthCalledWith(1, webviewRef)
    })
  })

  describe('unregisterWebview', () => {
    it('Should bail out and log if unregistering not registered webview', () => {
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
      }).not.toThrow()

      expect(mockDebug).toHaveBeenCalled()
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
          data: `{"type": "@post-me", "message": "${strings.webviewIsRendered}", "uri": "http://bar.com"}`,
          url: 'http://bar.com'
        }
      })

      expect(ParentHandshake).toHaveBeenCalledTimes(1)
    })

    it('Should bail out when init an existing webview', async () => {
      await expect(
        nativeService.tryEmit({
          nativeEvent: {
            data: `{"type": "@post-me", "message": "${strings.webviewIsRendered}", "uri": "http://bar.com"}`,
            url: 'http://bar.com'
          }
        })
      ).resolves.not.toThrow()

      expect(mockDebug).toHaveBeenCalled()
      expect(ParentHandshake).toHaveBeenCalledTimes(0)
    })

    it('Should bail out when init an undefined messenger', async () => {
      await expect(
        nativeService.tryEmit({
          nativeEvent: {
            data: `{"type": "@post-me", "message": "${strings.webviewIsRendered}", "uri": "http://taz.com"}`,
            url: 'http://zat.com'
          }
        })
      ).resolves.not.toThrow()

      expect(mockDebug).toHaveBeenCalled()
      expect(ParentHandshake).toHaveBeenCalledTimes(0)
    })
  })
})
