import get from 'lodash/get'
import memoize from 'lodash/memoize'
import { useState, useEffect } from 'react'

import { Registry } from 'cozy-client'

const memoizedFetchApp = memoize(
  (registry, slug) => {
    return registry.fetchApp(slug)
  },
  (registry, slug) => slug
)

const useMaintenanceStatus = (client, konnector) => {
  const { slug, source } = konnector

  const [isInMaintenance, setIsInMaintenance] = useState(false)
  const [messages, setMessages] = useState({})
  const [fetchStatus, setFetchStatus] = useState('idle')
  const [lastError, setLastError] = useState(null)

  useEffect(() => {
    const registry = new Registry({
      client
    })

    const fetchData = async () => {
      if (/^registry:\/\//i.test(source) === false) {
        // Only konnectors from the registry have a maintenance status, manually installed once are always considered OK
        setFetchStatus('loaded')
        return
      }
      try {
        setFetchStatus('loading')
        const appStatus = await memoizedFetchApp(registry, slug)
        const isInMaintenance = get(appStatus, 'maintenance_activated', false)
        const messages = get(appStatus, 'maintenance_options.messages', {})
        setFetchStatus('loaded')
        setIsInMaintenance(isInMaintenance)
        setMessages(messages)
      } catch (error) {
        setFetchStatus('failed')
        setLastError(error)
      }
    }
    fetchData()
  }, [client, slug, source])

  return {
    data: {
      isInMaintenance,
      messages
    },
    fetchStatus,
    lastError
  }
}

export default useMaintenanceStatus
