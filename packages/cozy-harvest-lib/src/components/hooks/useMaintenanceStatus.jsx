import { useQuery } from 'cozy-client'

import { buildAppsRegistryBySlug } from '../../helpers/queries'

const useMaintenanceStatus = slug => {
  const registryQuery = buildAppsRegistryBySlug(slug)
  const registryResult = useQuery(
    registryQuery.definition,
    registryQuery.options
  )

  return {
    data: {
      isInMaintenance: registryResult.data?.maintenance_activated ?? false,
      messages: registryResult.data?.maintenance_options?.messages ?? {}
    },
    fetchStatus: registryResult.fetchStatus,
    lastError: registryResult.lastError
  }
}

export default useMaintenanceStatus
