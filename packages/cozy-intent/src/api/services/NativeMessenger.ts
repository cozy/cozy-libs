import { Messenger } from 'post-me'

import { MessageListener, ListenerRemover } from '../models/messengers'
import { NativeEvent } from '../models/events'
import { Strings } from '../constants'
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

  public onMessage = (event: NativeEvent): void => {
    const data = <Record<string, unknown>>JSON.parse(event.nativeEvent.data)

    if (!this.listener) throw new Error(Strings.noListenerFound)

    this.listener({ data } as MessageEvent)
  }
}
