import { useState, useEffect } from 'react'
import { Registry } from 'cozy-client'
import get from 'lodash/get'

const useMaintenanceStatus = (client, slug) => {
  const [isInMaintenance, setIsInMaintenance] = useState(false)
  const [messages, setMessages] = useState({})
  const [fetchStatus, setFetchStatus] = useState('idle')
  const [lastError, setLastError] = useState(null)

  const registry = new Registry({
    client
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchStatus('loading')
        const appStatus = await registry.fetchApp(slug)
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
  }, [slug])

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
