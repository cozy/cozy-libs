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

const mockDebug = jest.fn<void, string[]>()

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
    (str: string): void =>
      mockDebug(nameSpace, str),
  ParentHandshake: jest.fn(() => Promise.resolve({ foo: 'bar' }))
}))

jest.mock('../services/NativeMessenger')

describe('NativeService', () => {
  let nativeMethods: NativeMethodsRegister

  beforeEach(() => {
    nativeMethods = {
      backToHome: jest.fn(),
      logout: jest.fn(),
      openApp: jest.fn(),
      hideSplashScreen: jest.fn(),
      setDefaultRedirection: jest.fn(),
      setFlagshipUI: jest.fn(),
      showSplashScreen: jest.fn(),
      isNativePassInstalledOnDevice: jest.fn(),
      scanDocument: jest.fn(),
      isScannerAvailable: jest.fn(),
      openSettingBiometry: jest.fn(),
      toggleSetting: jest.fn(),
      isBiometryDenied: jest.fn(),
      openAppOSSettings: jest.fn(),
      isAvailable: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should allow to register and unregister webviews, regardless of casing', async () => {
    const webviewRef: WebviewRef = {
      injectJavaScript: jest.fn(),
      props: {
        source: {
          uri: 'http://SOME_URI'
        }
      }
    }

    const nativeService = new NativeService(nativeMethods, MockNativeMessenger)

    nativeService.registerWebview('some_uri', webviewRef)

    await nativeService.tryEmit(
      {
        nativeEvent: { data: '{"type":"@post-me"}', url: 'http://some_uri' }
      },
      'SOME_COMPONENT_ID'
    )

    expect(onMessageMock).toHaveBeenNthCalledWith(1, { type: '@post-me' })

    nativeService.unregisterWebview('some_uri')

    await expect(
      nativeService.tryEmit(
        {
          nativeEvent: { data: '{"type":"@post-me"}', url: 'http://some_uri' }
        },
        'SOME_COMPONENT_ID'
      )
    ).resolves.not.toThrow()

    expect(mockDebug).toHaveBeenCalled()
    expect(onMessageMock).toHaveBeenCalledTimes(1)
  })

  describe('registerWebview', () => {
    it('Should allow to register a webview', () => {
      const webviewRef: WebviewRef = {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://SOME_URI'
          }
        }
      }

      const nativeService = new NativeService(nativeMethods)

      nativeService.registerWebview('some_uri', webviewRef)

      expect(NativeMessenger).toHaveBeenNthCalledWith(1, webviewRef)
    })

    it('Should bail out and log if registering two times the same webview', () => {
      const webviewRef: WebviewRef = {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://SOME_URI'
          }
        }
      }

      const nativeService = new NativeService(nativeMethods)

      nativeService.registerWebview('some_uri', webviewRef)

      expect(() => {
        nativeService.registerWebview('some_uri', webviewRef)
      }).not.toThrow()

      expect(mockDebug).toHaveBeenCalled()
    })

    it('Should allow to register a webview with a baseUrl instead of an uri', () => {
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

      nativeService.registerWebview('some_uri', webviewRef)

      expect(NativeMessenger).toHaveBeenNthCalledWith(1, webviewRef)
    })

    it('Should use correct uri with WebviewSourceBaseUrl', () => {
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

      nativeService.registerWebview('some_uri', webviewRef)
      nativeService.registerWebview('some_uri', webviewRef)

      const baseUrlFromWebview = 'some_uri'
      expect(mockDebug).toHaveBeenLastCalledWith(
        'NativeService',
        `Cannot register webview. A webview is already registered into cozy-intent with the uri: ${baseUrlFromWebview}`
      )
    })
  })

  describe('unregisterWebview', () => {
    it('Should bail out and log if unregistering not registered webview', () => {
      const nativeService = new NativeService(nativeMethods)

      expect(() => {
        nativeService.unregisterWebview('some_uri')
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
      await nativeService.tryEmit(
        {
          nativeEvent: { data: '{"not":"postme"}', url: '//bar' }
        },
        'SOME_COMPONENT_ID'
      )

      expect(onMessageMock).not.toHaveBeenCalled()
    })

    it('Should try to init a webview', async () => {
      nativeService.registerWebview('bar.com', {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://bar.com'
          }
        }
      })

      await nativeService.tryEmit(
        {
          nativeEvent: {
            data: `{"type": "@post-me", "message": "${strings.webviewIsRendered}", "uri": "http://bar.com"}`,
            url: 'http://bar.com'
          }
        },
        'SOME_COMPONENT_ID'
      )

      expect(ParentHandshake).toHaveBeenCalledTimes(1)
    })

    it('Should override existing connection when init existing webview', async () => {
      await expect(
        nativeService.tryEmit(
          {
            nativeEvent: {
              data: `{"type": "@post-me", "message": "${strings.webviewIsRendered}", "uri": "http://bar.com"}`,
              url: 'http://bar.com'
            }
          },
          'SOME_COMPONENT_ID'
        )
      ).resolves.not.toThrow()

      expect(mockDebug).not.toHaveBeenCalled()
      expect(ParentHandshake).toHaveBeenCalledTimes(1)
    })

    it('Should bail out when init an undefined messenger', async () => {
      await expect(
        nativeService.tryEmit(
          {
            nativeEvent: {
              data: `{"type": "@post-me", "message": "${strings.webviewIsRendered}", "uri": "http://taz.com"}`,
              url: 'http://zat.com'
            }
          },
          'SOME_COMPONENT_ID'
        )
      ).resolves.not.toThrow()

      expect(mockDebug).toHaveBeenCalled()
      expect(ParentHandshake).toHaveBeenCalledTimes(0)
    })

    it('Should inject component ID in setFlagshipUI calls', async () => {
      const webviewRef: WebviewRef = {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://SOME_URI'
          }
        }
      }

      const nativeService = new NativeService(
        nativeMethods,
        MockNativeMessenger
      )

      nativeService.registerWebview('some_uri', webviewRef)

      await expect(
        nativeService.tryEmit(
          {
            nativeEvent: {
              data: `{"type": "@post-me", "methodName": "setFlagshipUI", "args": [{"bottomTheme": "dark"}, "SOME_CALLER_NAME"]}`,
              url: 'http://SOME_URI'
            }
          },
          'SOME_COMPONENT_ID'
        )
      ).resolves.not.toThrow()

      expect(onMessageMock).toHaveBeenNthCalledWith(1, {
        type: '@post-me',
        methodName: 'setFlagshipUI',
        args: [
          { bottomTheme: 'dark', componentId: 'SOME_COMPONENT_ID' },
          'SOME_CALLER_NAME'
        ]
      })

      expect(mockDebug).toHaveBeenCalled()
      expect(ParentHandshake).toHaveBeenCalledTimes(0)
    })

    it('Should inject component ID in setTheme calls', async () => {
      const webviewRef: WebviewRef = {
        injectJavaScript: jest.fn(),
        props: {
          source: {
            uri: 'http://SOME_URI'
          }
        }
      }

      const nativeService = new NativeService(
        nativeMethods,
        MockNativeMessenger
      )

      nativeService.registerWebview('some_uri', webviewRef)

      await expect(
        nativeService.tryEmit(
          {
            nativeEvent: {
              data: `{"type": "@post-me", "methodName": "setTheme", "args": ["inverted"]}`,
              url: 'http://SOME_URI'
            }
          },
          'SOME_COMPONENT_ID'
        )
      ).resolves.not.toThrow()

      expect(onMessageMock).toHaveBeenNthCalledWith(1, {
        type: '@post-me',
        methodName: 'setTheme',
        args: [{ homeTheme: 'inverted', componentId: 'SOME_COMPONENT_ID' }]
      })

      expect(mockDebug).toHaveBeenCalled()
      expect(ParentHandshake).toHaveBeenCalledTimes(0)
    })
  })
})
