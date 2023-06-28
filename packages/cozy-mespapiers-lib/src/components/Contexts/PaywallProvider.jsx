import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import flag from 'cozy-flags'

import { buildFilesQueryWithQualificationLabel } from '../../helpers/queries'
import { computeMaxPapers } from '../PapersPaywall/helpers'

const PaywallContext = createContext()

const PaywallProvider = ({ children }) => {
  const [showPaywallState, setShowPaywallState] = useState(false)
  const [numberOfFilesCreatedByApp, setNumberOfFilesCreatedByApp] = useState(0)

  const isPaywallActivated = flag('mespapiers.aa-suggestion.disabled')
    ? false
    : numberOfFilesCreatedByApp >= computeMaxPapers()

  const filesQueryByLabels = buildFilesQueryWithQualificationLabel()
  const { data: files, ...queryResult } = useQueryAll(
    filesQueryByLabels.definition,
    filesQueryByLabels.options
  )
  const isLoadingFiles = isQueryLoading(queryResult) || queryResult.hasMore

  useEffect(() => {
    if (!isLoadingFiles) {
      const numberOfFile = files?.filter(
        file => file.cozyMetadata?.createdByApp === 'mespapiers'
      ).length

      setNumberOfFilesCreatedByApp(numberOfFile)
    }
  }, [isLoadingFiles, files])

  const value = useMemo(() => {
    return {
      isPaywallActivated,
      setShowPaywall: setShowPaywallState,
      showPaywall: showPaywallState
    }
  }, [isPaywallActivated, showPaywallState])

  return (
    <PaywallContext.Provider value={value}>{children}</PaywallContext.Provider>
  )
}

export default PaywallContext

export const usePaywall = () => {
  const paywallContext = useContext(PaywallContext)
  if (!paywallContext) {
    throw new Error('usePaywall must be used within a PaywallProvider')
  }
  return paywallContext
}

export { PaywallProvider }
