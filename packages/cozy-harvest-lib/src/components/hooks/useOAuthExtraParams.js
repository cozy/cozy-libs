import { useEffect, useState } from 'react'

import { findKonnectorPolicy } from '../../konnector-policies'

const useOAuthExtraParams = ({ account, client, konnector, reconnect }) => {
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const needsExtraParams = konnectorPolicy.fetchExtraOAuthUrlParams

  const [fetchStatus, setFetchStatus] = useState('loading')
  const [extraParams, setExtraParams] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const extraParams = await konnectorPolicy.fetchExtraOAuthUrlParams({
          account,
          konnector,
          client,
          reconnect
        })
        setExtraParams(extraParams)
        setFetchStatus('loaded')
      } catch {
        setFetchStatus('errored')
      }
    }
    if (needsExtraParams) {
      load()
    }
  })

  return {
    fetchStatus,
    needsExtraParams,
    extraParams
  }
}

export default useOAuthExtraParams
