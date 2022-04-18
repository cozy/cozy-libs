import { Connection, ParentHandshake } from 'post-me'

import {
  DebugNativeMessenger,
  MessengerRegister,
  NativeEvent,
  NativeMessenger,
  NativeMethodsRegister,
  PostMeMessage,
  WebviewRef,
  strings
} from '../../api'
import { interpolate, isNativeDevMode } from '../../utils'

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

  private isWebviewRef(object: unknown): object is WebviewRef {
    return (object as WebviewRef).injectJavaScript !== undefined
  }

  private getUri = (source: WebviewRef | NativeEvent): string => {
    return this.isWebviewRef(source)
      ? new URL(source.props.source.uri).hostname
      : new URL(source.nativeEvent.url).hostname
  }

  private parseNativeEvent = ({ nativeEvent }: NativeEvent): PostMeMessage =>
    <PostMeMessage>JSON.parse(nativeEvent.data)

  private isPostMeMessage = (message: PostMeMessage): boolean =>
    message.type === strings.postMeSignature

  private isInitMessage = (message: PostMeMessage): boolean =>
    message.message === strings.webviewIsRendered

  public registerWebview = (webviewRef: WebviewRef): void => {
    const uri = this.getUri(webviewRef)

    if (this.messengerRegister[uri]) {
      throw new Error(interpolate(strings.errorRegisterWebview, { uri }))
    }

    const messenger = new this.messengerService(webviewRef)

    this.messengerRegister = {
      ...this.messengerRegister,
      [uri]: {
        messenger: isNativeDevMode()
          ? DebugNativeMessenger(messenger)
          : messenger
      }
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
    const parsedEvent = this.parseNativeEvent(event)

    if (!this.isPostMeMessage(parsedEvent)) return

    return this.isInitMessage(parsedEvent)
      ? await this.tryInit(event)
      : this.tryOnMessage(event, parsedEvent)
  }

  private tryInit = async (event: NativeEvent): Promise<void> => {
    const uri = this.getUri(event)

    if (this.messengerRegister[uri].connection)
      throw new Error(interpolate(strings.errorInitWebview, { uri }))

    this.messengerRegister[uri].connection = await this.initWebview(
      this.messengerRegister[uri].messenger
    )
  }

  private tryOnMessage = (event: NativeEvent, message: PostMeMessage): void => {
    const webviewUri = this.getUri(event)
    const registeredWebview = this.messengerRegister[webviewUri]

    if (registeredWebview === undefined) {
      throw new Error(interpolate(strings.errorEmitMessage, { webviewUri }))
    }

    this.messengerRegister[webviewUri].messenger.onMessage(message)
  }
}
