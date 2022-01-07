import { ParentHandshake } from 'post-me'

import { MessengerRegister } from '../models/messengers'
import { NativeEvent } from '../models/events'
import { NativeMessenger } from '../services/NativeMessenger'
import { NativeMethodsRegister } from '../models/methods'
import { WebviewRef } from '../models/environments'
import { Numbers, Strings } from '../constants'

export class NativeService {
  private messengerService = NativeMessenger

  private messengerRegister = {} as MessengerRegister

  public registerWebview = async (
    webviewRef: WebviewRef,
    localMethods: NativeMethodsRegister
  ): Promise<void> => {
    const uri = new URL(webviewRef.props.source.uri).hostname

    if (this.messengerRegister[uri]) return

    const messenger = new this.messengerService(webviewRef)

    this.messengerRegister = {
      ...this.messengerRegister,
      [uri]: { messenger }
    }

    await ParentHandshake(
      messenger,
      localMethods,
      Numbers.maxAttempts,
      Numbers.attemptsInterval
    )
  }

  public tryEmit = (event: NativeEvent): void => {
    if (!event.nativeEvent.data.includes(Strings.postMeSignature)) return

    this.messengerRegister[
      new URL(event.nativeEvent.url).hostname
    ].messenger.onMessage(event)
  }
}
