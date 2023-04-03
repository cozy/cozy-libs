import React, { createContext, useContext, useMemo, useState } from 'react'

import { useClient } from 'cozy-client'
import useRealtime from 'cozy-realtime/dist/useRealtime'

import { addAllOnce, search, makeRealtimeConnection } from './helpers'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

const SearchProvider = ({ doctypes, t, scannerT, children }) => {
  const [isInit, setIsInit] = useState(false)
  const client = useClient()

  const realtimeConnection = useMemo(
    () => makeRealtimeConnection(doctypes, scannerT, t),
    [doctypes, scannerT, t]
  )
  useRealtime(client, realtimeConnection)

  const value = useMemo(() => {
    return {
      addAllOnce: addAllOnce({
        isAdded: isInit,
        setIsAdded: setIsInit,
        scannerT,
        t
      }),
      search
    }
  }, [isInit, t, scannerT])

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export default SearchProvider
