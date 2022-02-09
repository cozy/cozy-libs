import { Connection } from 'post-me'
import { NativeMessenger } from '../services/NativeMessenger'

export interface MessengerRegister {
  id: { connection: Connection; messenger: NativeMessenger }
  [key: string]: { connection?: Connection; messenger: NativeMessenger }
}

export type MessageListener = (event: MessageEvent) => void

export type ListenerRemover = () => void
