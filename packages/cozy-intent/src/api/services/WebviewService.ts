import { Connection, EventsType, MethodsType, RemoteHandle } from 'post-me'

import { NativeMethodsRegister } from '../models/methods'

export class WebviewService {
  private close: () => void
  private remoteHandle: RemoteHandle<NativeMethodsRegister>

  constructor(
    connection: Connection<
      MethodsType,
      EventsType,
      NativeMethodsRegister,
      EventsType
    >
  ) {
    this.remoteHandle = connection.remoteHandle()
    this.close = (): void => connection.close()
  }

  public call = (
    methodName: keyof NativeMethodsRegister,
    ...args: Parameters<NativeMethodsRegister[keyof NativeMethodsRegister]>
  ): Promise<void> => this.remoteHandle.call(methodName, ...args)

  public closeMessenger = (): void => this.close()
}
