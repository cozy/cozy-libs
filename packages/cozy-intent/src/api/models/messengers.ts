import { NativeMessenger } from '../services/NativeMessenger'

export interface MessengerRegister {
  id: { messenger: NativeMessenger }
  [key: string]: { messenger: NativeMessenger }
}

export type MessageListener = (event: MessageEvent) => void

export type ListenerRemover = () => void
