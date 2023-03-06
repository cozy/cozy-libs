import React, { createContext, useContext, useMemo, useState } from 'react'

import { useClient } from 'cozy-client'
import useRealtime from 'cozy-realtime/dist/useRealtime'

import { add, search, makeRealtimeConnection } from './helpers'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

const SearchProvider = ({ doctypes, t, children }) => {
  const [isInit, setIsInit] = useState(false)
  const client = useClient()

  const realtimeConnection = useMemo(
    () => makeRealtimeConnection(doctypes, t),
    [doctypes, t]
  )
  useRealtime(client, realtimeConnection)

  const value = useMemo(() => {
    return {
      add: add(isInit, t, setIsInit),
      search
    }
  }, [isInit, t])

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export default SearchProvider
