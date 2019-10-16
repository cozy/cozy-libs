import { useState, useEffect } from 'react'
import { Registry } from 'cozy-client'
import get from 'lodash/get'

const useMaintenanceStatus = (client, slug) => {
  const [maintenanceStatus, setMaintenanceStatus] = useState({
    isInMaintenance: false,
    messages: {}
  })
  const registry = new Registry({
    client
  })

  useEffect(() => {
    const fetchData = async () => {
      const appStatus = await registry.fetchApp(slug)
      const isInMaintenance = get(appStatus, 'maintenance_activated', false)
      const messages = get(appStatus, 'maintenance_options.messages', {})
      setMaintenanceStatus({ isInMaintenance, messages })
    }
    fetchData()
  }, [slug])

  return maintenanceStatus
}

export default useMaintenanceStatus
