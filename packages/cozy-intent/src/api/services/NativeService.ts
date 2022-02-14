import { Connection, ParentHandshake } from 'post-me'

import { MessengerRegister } from '../models/messengers'
import { NativeEvent, ParsedNativeEvent } from '../models/events'
import { NativeMessenger } from '../services/NativeMessenger'
import { NativeMethodsRegister } from '../models/methods'
import { TypeguardService } from './TypeguardService'
import { WebviewRef } from '../models/environments'
import { interpolate } from '../../utils'
import { strings } from '../constants'

export class NativeService {
  private readonly messengerService: typeof NativeMessenger

  private readonly localMethods: NativeMethodsRegister
  private messengerRegister = {} as MessengerRegister

  constructor(
    localMethods: NativeMethodsRegister,
    messengerService = NativeMessenger
  ) {
    this.messengerService = messengerService
    this.localMethods = localMethods
  }

  private getUri = (source: WebviewRef | NativeEvent): string => {
    return TypeguardService.isWebviewRef(source)
      ? new URL(source.props.source.uri).hostname
      : new URL(source.nativeEvent.url).hostname
  }

  private parseNativeEvent = ({
    nativeEvent
  }: NativeEvent): ParsedNativeEvent =>
    <ParsedNativeEvent>JSON.parse(nativeEvent.data)

  private isPostMeMessage = ({ nativeEvent }: NativeEvent): boolean =>
    nativeEvent.data.includes(strings.postMeSignature)

  private isInitMessage = (event: NativeEvent): boolean =>
    this.parseNativeEvent(event).message === strings.webviewIsRendered

  public registerWebview = (webviewRef: WebviewRef): void => {
    const uri = this.getUri(webviewRef)

    if (this.messengerRegister[uri]) {
      throw new Error(interpolate(strings.errorRegisterWebview, { uri }))
    }

    this.messengerRegister = {
      ...this.messengerRegister,
      [uri]: { messenger: new this.messengerService(webviewRef) }
    }
  }

  public unregisterWebview = (webviewRef: WebviewRef): void => {
    const uri = this.getUri(webviewRef)

    if (!this.messengerRegister[uri]) {
      throw new Error(interpolate(strings.errorUnregisterWebview, { uri }))
    }

    delete this.messengerRegister[uri]
  }

  private initWebview = async (
    messenger: NativeMessenger
  ): Promise<Connection> => await ParentHandshake(messenger, this.localMethods)

  public tryEmit = async (event: NativeEvent): Promise<void> => {
    if (!this.isPostMeMessage(event)) return

    return this.isInitMessage(event)
      ? await this.tryInit(event)
      : this.tryOnMessage(event)
  }

  private tryInit = async (event: NativeEvent): Promise<void> => {
    const uri = this.getUri(event)

    if (this.messengerRegister[uri].connection)
      throw new Error(interpolate(strings.errorInitWebview, { uri }))

    this.messengerRegister[uri].connection = await this.initWebview(
      this.messengerRegister[uri].messenger
    )
  }

  private tryOnMessage = (event: NativeEvent): void => {
    const parsedEvent = this.parseNativeEvent(event)
    const webviewUri = this.getUri(event)
    const registeredWebview = this.messengerRegister[webviewUri]

    if (registeredWebview === undefined) {
      throw new Error(interpolate(strings.errorEmitMessage, { webviewUri }))
    }

    this.messengerRegister[webviewUri].messenger.onMessage(parsedEvent)
  }
}
