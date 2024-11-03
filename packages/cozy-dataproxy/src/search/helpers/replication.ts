import CozyClient from 'cozy-client'
import Minilog from 'cozy-minilog'

import { getPouchLink } from './client'

const log = Minilog('🗂️ [Replication]')

export const startReplicationWithDebounce = (
  client: CozyClient,
  interval: number
) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (): void => {
    if (timeoutId) {
      log.debug('Reset replication debounce')
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      const pouchLink = getPouchLink(client)
      if (!pouchLink) {
        return
      }
      log.debug('Start replication after debounce of ', interval)
      pouchLink.startReplication()
    }, interval)
  }
}
