import { useEffect, useState } from 'react'

import { findKonnectorPolicy } from '../../konnector-policies'

import useDeepCompareEffect from 'use-deep-compare-effect'

const useBITemporaryToken = ({ account, client, konnector }) => {
  const konnectorPolicy = findKonnectorPolicy(konnector)

  const [fetchStatus, setFetchStatus] = useState(null)
  const [tokenResponse, setTokenResponse] = useState(null)

  const needsToken = Boolean(konnectorPolicy.createTemporaryToken)
  const needsRefresh = needsToken && fetchStatus !== 'loading'

  // use useDeepCompareEffect to avoid an infinite rerender since the konnector object is a new one
  // on each render when used in the home application
  useEffect(() => {
    const load = async () => {
      try {
        setFetchStatus('loading')
        const tokenResponse = await konnectorPolicy.createTemporaryToken({
          client,
          konnector,
          account
        })
        setTokenResponse(tokenResponse)
        setFetchStatus('loaded')
      } catch (err) {
        setFetchStatus('errored')
      }
    }
    if (needsRefresh) {
      load()
    }
  }, [])

  return {
    fetchStatus,
    tokenResponse
  }
}

export default useBITemporaryToken
