import { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { findKonnectorPolicy } from '../../konnector-policies'

const useOAuthExtraParams = ({ account, client, konnector, reconnect }) => {
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const needsExtraParams = konnectorPolicy.fetchExtraOAuthUrlParams

  const [fetchStatus, setFetchStatus] = useState('loading')
  const [extraParams, setExtraParams] = useState(null)

  // use useDeepCompareEffect to avoid an infinite rerender since the konnector object is a new one
  // on each render when used in the home application
  useDeepCompareEffect(() => {
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
  }, [account, client, konnector, konnectorPolicy, needsExtraParams, reconnect])

  return {
    fetchStatus,
    needsExtraParams,
    extraParams
  }
}

export default useOAuthExtraParams
