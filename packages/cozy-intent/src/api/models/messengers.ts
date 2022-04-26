import { Connection } from 'post-me'

import { NativeMessenger } from '../../api'

export interface MessengerRegister {
  id: { connection: Connection; messenger: NativeMessenger }
  [key: string]:
    | { connection?: Connection; messenger: NativeMessenger }
    | undefined
}

export type MessageListener = (event: MessageEvent) => void

export type ListenerRemover = () => void
