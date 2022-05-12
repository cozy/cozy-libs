import { Messenger, debug } from 'post-me'

import {
  ListenerRemover,
  MessageListener,
  PostMeMessage,
  WebviewRef,
  strings
} from '../../api'

const log = debug('NativeMessenger')

export class NativeMessenger implements Messenger {
  private injectJavaScript?: (data: string) => void
  private listener?: MessageListener

  constructor(webviewRef: WebviewRef) {
    this.injectJavaScript = webviewRef.injectJavaScript
  }

  public postMessage = (message: Record<string, unknown>): void => {
    try {
      const script = `window.postMessage(${JSON.stringify(message)})`
      this.injectJavaScript?.(script)
    } catch (error) {
      log(strings.noWebviewFound)
    }
  }

  public addMessageListener = (listener: MessageListener): ListenerRemover => {
    this.listener = listener

    const removeListener = (): void => (this.listener = undefined)

    return removeListener
  }

  public onMessage = (data: PostMeMessage): void => {
    if (!this.listener) return log(strings.noListenerFound)

    this.listener({ data } as MessageEvent)
  }
}

export const DebugNativeMessenger = (
  messenger: NativeMessenger
): NativeMessenger => {
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
