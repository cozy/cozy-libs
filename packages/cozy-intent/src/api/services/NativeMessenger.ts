import { Messenger } from 'post-me'

import { MessageListener, ListenerRemover } from '../models/messengers'
import { ParsedNativeEvent } from '../models/events'
import { strings } from '../constants'
import { WebviewRef } from '../models/environments'

export class NativeMessenger implements Messenger {
  private injectJavaScript: (data: string) => void
  private listener?: MessageListener

  constructor(webviewRef: WebviewRef) {
    this.injectJavaScript = webviewRef.injectJavaScript
  }

  public postMessage = (message: unknown): void => {
    const script = `window.postMessage(${JSON.stringify(message)})`
    this.injectJavaScript(script)
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
