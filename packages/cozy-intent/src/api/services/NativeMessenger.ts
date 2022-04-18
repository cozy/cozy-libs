import { Messenger, debug } from 'post-me'

import {
  ListenerRemover,
  MessageListener,
  PostMeMessage,
  WebviewRef,
  strings
} from '../../api'

export class NativeMessenger implements Messenger {
  private injectJavaScript?: (data: string) => void
  private listener?: MessageListener

  constructor(webviewRef: WebviewRef) {
    this.injectJavaScript = webviewRef.injectJavaScript
  }

  public postMessage = (message: Record<string, unknown>): void => {
    const script = `window.postMessage(${JSON.stringify(message)})`
    this.injectJavaScript?.(script)
  }

  public addMessageListener = (listener: MessageListener): ListenerRemover => {
    this.listener = listener

    const removeListener = (): void => (this.listener = undefined)

    return removeListener
  }

  public onMessage = (data: PostMeMessage): void => {
    if (!this.listener) throw new Error(strings.noListenerFound)

    this.listener({ data } as MessageEvent)
  }
}

export const DebugNativeMessenger = (
  messenger: NativeMessenger
): NativeMessenger => {
  const log = debug('NativeMessenger')

  return {
    postMessage: (message: Record<string, unknown>): void => {
      message.action !== 'response' && log('- OUT', message)
      messenger.postMessage(message)
    },
    addMessageListener: (listener: MessageListener): ListenerRemover =>
      messenger.addMessageListener(listener),
    onMessage: (data: PostMeMessage): void => {
      log('- IN', data)
      messenger.onMessage(data)
    }
  }
}
