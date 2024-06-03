import { Connection } from 'post-me'

import { NativeMessenger } from '../../api'

export interface MessengerRegister {
  id: { connection: Connection; messenger: NativeMessenger; slug: string }
  [key: string]:
    | { connection?: Connection; messenger: NativeMessenger; slug: string }
    | undefined
}

export type MessageListener = (event: MessageEvent) => void

export type ListenerRemover = () => void
