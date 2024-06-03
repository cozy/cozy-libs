import { Connection, debug, ParentHandshake } from 'post-me'

import {
  DebugNativeMessenger,
  MessengerRegister,
  NativeEvent,
  NativeMessenger,
  NativeMethodsRegister,
  PostMeMessage,
  WebviewRef,
  strings,
  numbers,
  WebviewMethods
} from '../../api'
import {
  getErrorMessage,
  interpolate,
  isFlagshipUiArgsArray,
  isNativeDevMode,
  isThemeArg
} from '../../utils'

const log = debug('NativeService')

export class NativeService {
  private readonly messengerService: typeof NativeMessenger

  private localMethods: NativeMethodsRegister
  private messengerRegister = {} as MessengerRegister

  constructor(
    localMethods: NativeMethodsRegister,
    messengerService = NativeMessenger
  ) {
    this.messengerService = messengerService
    this.localMethods = localMethods
  }

  public updateLocalMethods = (localMethods: NativeMethodsRegister): void => {
    this.localMethods = localMethods
  }

  private isNativeEvent(object: unknown): object is NativeEvent {
    return (object as NativeEvent).nativeEvent.data !== undefined
  }

  private getUri = (source: NativeEvent): string =>
    new URL(source.nativeEvent.url).hostname.toLowerCase()

  private parseNativeEvent = ({ nativeEvent }: NativeEvent): PostMeMessage =>
    <PostMeMessage>JSON.parse(nativeEvent.data)

  private isPostMeMessage = (message: PostMeMessage): boolean =>
    message.type === strings.postMeSignature

  private isInitMessage = (message: PostMeMessage): boolean =>
    message.message === strings.webviewIsRendered

  public registerWebview = (
    uri: string,
    slug: string,
    ref: WebviewRef
  ): void => {
    log(strings.logging.registering(uri))

    if (this.messengerRegister[uri])
      return log(interpolate(strings.errorRegisterWebview, { uri }))

    const messenger = new this.messengerService(ref)

    this.messengerRegister = {
      ...this.messengerRegister,
      [uri]: {
        messenger: isNativeDevMode()
          ? DebugNativeMessenger(messenger)
          : messenger,
        slug
      }
    }

    log(strings.logging.registered(uri))
  }

  public unregisterWebview = (uri: string): void => {
    log(strings.logging.unregistering(uri))

    if (!this.messengerRegister[uri])
      return log(interpolate(strings.errorUnregisterWebview, { uri }))

    delete this.messengerRegister[uri]

    log(strings.logging.unregistered(uri))
  }

  private initWebview = async (
    messenger: NativeMessenger
  ): Promise<Connection> =>
    await ParentHandshake(messenger, this.localMethods, numbers.maxAttempts)

  public tryEmit = async (
    event: NativeEvent,
    componentId: string
  ): Promise<void> => {
    if (!this.isNativeEvent(event)) return

    const parsedEvent = this.parseNativeEvent(event)

    if (
      parsedEvent.methodName === 'setFlagshipUI' &&
      isFlagshipUiArgsArray(parsedEvent.args)
    ) {
      parsedEvent.args[0].componentId = componentId
    }

    if (
      parsedEvent.methodName === 'setTheme' &&
      Array.isArray(parsedEvent.args) &&
      isThemeArg(parsedEvent.args[0])
    ) {
      parsedEvent.args[0] = {
        homeTheme: parsedEvent.args[0],
        componentId: componentId
      }
    }

    if (this.isInitMessage(parsedEvent)) return await this.tryInit(event)

    if (this.isPostMeMessage(parsedEvent)) this.tryOnMessage(event, parsedEvent)
  }

  private tryInit = async (event: NativeEvent): Promise<void> => {
    const uri = this.getUri(event)
    const messengerToInit = this.messengerRegister[uri]

    try {
      if (!messengerToInit)
        throw new Error(interpolate(strings.errorNoMessengerToInit, { uri }))

      messengerToInit.connection = await this.initWebview(
        messengerToInit.messenger
      )
    } catch (error) {
      log(
        interpolate(strings.errorParentHandshake, {
          uri,
          errorMessage: getErrorMessage(error)
        })
      )
    }
  }

  private tryOnMessage = (event: NativeEvent, message: PostMeMessage): void => {
    const webviewUri = this.getUri(event)
    const registeredWebview = this.messengerRegister[webviewUri]

    if (registeredWebview === undefined) {
      return log(interpolate(strings.errorEmitMessage, { webviewUri }))
    }

    message.args?.unshift({
      slug: registeredWebview.slug
    })

    registeredWebview.messenger.onMessage(message)
  }

  private getHostname = (uri: string): string => {
    try {
      return new URL(uri).hostname.toLowerCase()
    } catch {
      return uri
    }
  }

  public call = (
    uri: string,
    methodName: keyof WebviewMethods,
    ...args: Parameters<NativeMethodsRegister[keyof NativeMethodsRegister]>
  ): ReturnType<NativeMethodsRegister[keyof NativeMethodsRegister]> | void =>
    this.messengerRegister[this.getHostname(uri)]?.connection
      ?.remoteHandle()
      .call(methodName, ...args)
}
