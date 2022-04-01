import { Messenger, debug } from 'post-me'

import {
  ListenerRemover,
  MessageListener,
  ParsedNativeEvent,
  WebviewRef,
  strings
} from '../../api'

export class NativeMessenger implements Messenger {
  private injectJavaScript?: (data: string) => void
  private listener?: MessageListener

  constructor(webviewRef: WebviewRef) {
    this.injectJavaScript = webviewRef.injectJavaScript
  }

  public postMessage = (message: unknown): void => {
    const script = `window.postMessage(${JSON.stringify(message)})`
    this.injectJavaScript?.(script)
  }

  public addMessageListener = (listener: MessageListener): ListenerRemover => {
    this.listener = listener

    const removeListener = (): void => (this.listener = undefined)

    return removeListener
  }

  public onMessage = (data: ParsedNativeEvent): void => {
    if (!this.listener) throw new Error(strings.noListenerFound)

    this.listener({ data } as MessageEvent)
  }
}

export const DebugNativeMessenger = (
  messenger: NativeMessenger
): NativeMessenger => {
  const log = debug('native-messenger')

  return {
    postMessage: (message: unknown): void => {
      log('➡️ sending message', message)
      messenger.postMessage(message)
    },
    addMessageListener: (listener: MessageListener): ListenerRemover =>
      messenger.addMessageListener(listener),
    onMessage: (data: ParsedNativeEvent): void => {
      log('⬅️ received message', data)
      messenger.onMessage(data)
    }
  }
}
