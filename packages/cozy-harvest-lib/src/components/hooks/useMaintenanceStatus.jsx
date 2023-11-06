import { useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { buildAppsRegistryBySlug } from '../../helpers/queries'

const useMaintenanceStatus = slug => {
  const skipMaintenanceList = flag('harvest.skip-maintenance-for.list') ?? []
  const skipMaintenance = skipMaintenanceList.includes(slug)

  const registryQuery = buildAppsRegistryBySlug(slug)
  const registryResult = useQuery(registryQuery.definition, {
    ...registryQuery.options,
    enabled: !skipMaintenance
  })

  if (skipMaintenance) {
    return {
      data: {
        isInMaintenance: false,
        messages: {}
      },
      fetchStatus: 'loaded',
      lastError: null
    }
  }

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
