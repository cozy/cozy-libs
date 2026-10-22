import type CozyClient from 'cozy-client'

import { CozyDoc } from '../types'

declare module 'cozy-realtime' {
  export interface RealtimePluginType {
    (): void
    pluginName: 'realtime'
  }

  export const RealtimePlugin: RealtimePluginType

  export class HandshakeQueue {
    constructor(options?: {
      maxConcurrent?: number
      slotTimeout?: number
      logger?: unknown
    })
    acquire(): Promise<{ release: () => void }>
  }

  export default class CozyRealtime {
    constructor(options: {
      client: CozyClient
      sharedDriveId?: string
      background?: boolean
      handshakeQueue?: HandshakeQueue
    })
    subscribe(
      event: string,
      doctype: string,
      handler: (doc: CozyDoc) => void
    ): void
    isAlive(): boolean
    stop(): void
  }
}
