import throttle from 'lodash/throttle'
import { useCallback, useMemo } from 'react'
import { useRealtime } from 'cozy-realtime'
import { useClient } from 'cozy-client'
import logger from '../logger'

const RefetchQueryRealtime = ({ doctype, queryResult, filter }) => {
  const client = useClient()
  const { fetch } = queryResult
  const debouncedFetch = useMemo(() => throttle(fetch, 300), [fetch])
  const refetch = useCallback(
    obj => {
      if (!filter || filter(obj)) {
        logger('info', 'Refetching query')
        debouncedFetch()
      }
    },
    [debouncedFetch, filter]
  )
  useRealtime(
    client,
    {
      [doctype]: {
        created: refetch,
        updated: refetch,
        deleted: refetch
      }
    },
    [refetch]
  )
  return null
}

export default RefetchQueryRealtime
