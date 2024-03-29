export const strings = {
  flagshipButNoRNAPI:
    '<WebviewIntentProvider /> can not instantiate its service. The application was detected as running in a Flagship webview but has no access to `window.ReactNativeWebView`, which is contradictory.',
  noListenerFound:
    'Could not handle event, this `NativeMessenger` instance does not have a listener.',
  noWebviewFound:
    'error: no WebView was found when trying to post message. This might mean we exited a CozyApp without waiting the call("backToHome") response.',
  postMeSignature: '@post-me',
  webviewIsRendered: 'webviewIsRendered',
  errorRegisterWebview:
    'Cannot register webview. A webview is already registered into cozy-intent with the uri: ${uri}',
  errorUnregisterWebview:
    'Cannot unregister webview. No webview is registered into cozy-intent with the uri: ${uri}',
  errorEmitMessage:
    'Cannot emit message. No webview is registered with uri: ${webviewUri}',
  errorCozyBarAPIMissing:
    'Cozy-bar was detected by WebviewIntentProvider but the required setWebviewContext() API was not found. Cozy-bar webview intents will not work. Your cozy-bar version is most likely outdated.',
  errorParentHandshake:
    'Handshake failed for uri: "${uri}". ConcreteConnection will not be available for this uri\'s messenger, but messages should still work. Error was: "${errorMessage}".',
  errorNoMessengerToInit:
    'Could not initialise messenger for uri: "${uri}. No WebView has been registered from react-native with this uri. Please use NativeService.registerWebview(WebviewRef).',
  logging: {
    registering: (uri: string): string => `- REGISTERING ▶️ "${uri}"`,
    registered: (uri: string): string => `- REGISTERED ▶️ "${uri}"`,
    unregistering: (uri: string): string => `- UNREGISTERING ▶️ "${uri}"`,
    unregistered: (uri: string): string => `- UNREGISTERED ▶️ "${uri}"`
  }
}
