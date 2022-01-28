import { Connection, ParentHandshake } from 'post-me'

import { MessengerRegister } from '../models/messengers'
import { NativeEvent } from '../models/events'
import { NativeMessenger } from '../services/NativeMessenger'
import { NativeMethodsRegister } from '../models/methods'
import { StaticService } from './StaticService'
import { Strings } from '../constants'
import { WebviewRef } from '../models/environments'

export class NativeService {
  private messengerService: typeof NativeMessenger

  private localMethods: NativeMethodsRegister
  private messengerRegister = {} as MessengerRegister

  constructor(
    localMethods: NativeMethodsRegister,
    messengerService = NativeMessenger
  ) {
    this.messengerService = messengerService
    this.localMethods = localMethods
  }

  public registerWebview = (webviewRef: WebviewRef): void => {
    const uri = StaticService.getUri(webviewRef)

    if (this.messengerRegister[uri]) {
      throw new Error(
        `Cannot register webview. A webview is already registered into cozy-intent with the uri: ${uri}`
      )
    }

    this.messengerRegister = {
      ...this.messengerRegister,
      [uri]: { messenger: new this.messengerService(webviewRef) }
    }
  }

  public unregisterWebview = (webviewRef: WebviewRef): void => {
    const uri = StaticService.getUri(webviewRef)

    if (!this.messengerRegister[uri]) {
      throw new Error(
        `Cannot unregister webview. No webview is registered into cozy-intent with the uri: ${uri}`
      )
    }

    delete this.messengerRegister[uri]
  }

  private initWebview = async (
    messenger: NativeMessenger
  ): Promise<Connection> => await ParentHandshake(messenger, this.localMethods)

  public tryEmit = async (event: NativeEvent): Promise<void> => {
    if (!StaticService.isPostMeMessage(event)) return

    const { message, uri } = StaticService.parseNativeEvent(event)

    if (message === Strings.webviewIsRendered)
      await this.initWebview(this.messengerRegister[uri].messenger)
    else
      this.messengerRegister[StaticService.getUri(event)].messenger.onMessage(
        event
      )
  }
}
