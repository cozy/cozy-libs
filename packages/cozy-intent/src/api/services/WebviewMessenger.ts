import { Messenger } from 'post-me'

import { MessageListener, ListenerRemover } from '../models/messengers'
import { WebviewWindow } from '../models/environments'

export class WebviewMessenger implements Messenger {
  private windowRef: WebviewWindow

  constructor(windowRef: WebviewWindow) {
    this.windowRef = windowRef
  }

  public postMessage = (message: Record<string, unknown>): void =>
    this.windowRef.ReactNativeWebView.postMessage(JSON.stringify(message))

  public addMessageListener = (listener: MessageListener): ListenerRemover => {
    const outerListener = (event: MessageEvent): void => listener(event)

    this.windowRef.addEventListener('message', outerListener)

    const removeMessageListener = (): void =>
      this.windowRef.removeEventListener('message', outerListener)

    return removeMessageListener
  }
}
