import { Messenger, debug } from 'post-me'

import { ListenerRemover, MessageListener, WebviewWindow } from '../../api'

export class WebviewMessenger implements Messenger {
  private windowRef?: WebviewWindow

  constructor(windowRef: WebviewWindow) {
    this.windowRef = windowRef
  }

  public postMessage = (message: Record<string, unknown>): void =>
    this.windowRef?.ReactNativeWebView.postMessage(JSON.stringify(message))

  public addMessageListener = (listener: MessageListener): ListenerRemover => {
    const outerListener = (event: MessageEvent): void => listener(event)

    this.windowRef?.addEventListener('message', outerListener)

    const removeMessageListener = (): void =>
      this.windowRef?.removeEventListener('message', outerListener)

    return removeMessageListener
  }
}

export const DebugWebviewMessenger = (
  messenger: WebviewMessenger
): WebviewMessenger => {
  const log = debug('WebviewMessenger')

  return {
    postMessage: (message: Record<string, unknown>): void => {
      message.action !== 'response' && log('- OUT', message)
      messenger.postMessage(message)
    },
    addMessageListener: (listener: MessageListener): ListenerRemover =>
      messenger.addMessageListener(listener)
  }
}
