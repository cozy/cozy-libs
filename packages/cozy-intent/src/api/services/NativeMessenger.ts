import { Strings } from 'api/constants'
import { Messenger } from 'post-me'

import { WebviewRef } from '../models/environments'
import { NativeEvent } from '../models/events'
import { MessageListener, ListenerRemover } from '../models/messengers'

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
