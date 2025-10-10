import type CozyClient from 'cozy-client'

import { CozyDoc } from '../types'

declare module 'cozy-realtime' {
  export interface RealtimePluginType {
    (): void
    pluginName: 'realtime'
  }

  export const RealtimePlugin: RealtimePluginType

  export default class CozyRealtime {
    constructor(options: { client: CozyClient; sharedDriveId?: string })
    subscribe(
      event: string,
      doctype: string,
      handler: (doc: CozyDoc) => void
    ): void
    stop(): void
  }
}
