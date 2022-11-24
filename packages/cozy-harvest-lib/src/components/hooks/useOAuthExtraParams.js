import { useState } from 'react'

import { findKonnectorPolicy } from '../../konnector-policies'

import useDeepCompareEffect from 'use-deep-compare-effect'
import logger from '../../logger'

const useOAuthExtraParams = ({
  account,
  client,
  konnector,
  reconnect = false,
  manage = false
}) => {
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
          tokenResponse,
          reconnect,
          manage
        })
        setExtraParams(extraParams)
        setFetchStatus('loaded')
      } catch (err) {
        logger.error('useOAuthExtraParams error', err)
        setFetchStatus('errored')
      }
    }
    if (needsExtraParams) {
      load()
    }
  }, [
    account,
    client,
    konnector,
    konnectorPolicy,
    needsExtraParams,
    reconnect,
    manage
  ])

  return {
    fetchStatus,
    needsExtraParams,
    extraParams
  }
}

export default useOAuthExtraParams
