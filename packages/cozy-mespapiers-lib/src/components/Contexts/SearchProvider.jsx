import React, { createContext, useContext, useMemo, useState } from 'react'
import useRealtime from 'cozy-realtime/dist/useRealtime'
import { useClient } from 'cozy-client'
import { FILES_DOCTYPE, CONTACTS_DOCTYPE } from '../../doctypes'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { onCreate, onUpdate, add, search } from './helpers'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

const SearchProvider = ({ children }) => {
  const [isInit, setIsInit] = useState(false)
  const client = useClient()
  const scannerT = useScannerI18n()

  useRealtime(client, {
    [FILES_DOCTYPE]: {
      created: onCreate(FILES_DOCTYPE, scannerT),
      updated: onUpdate(FILES_DOCTYPE)
    },
    [CONTACTS_DOCTYPE]: {
      created: onCreate(CONTACTS_DOCTYPE),
      updated: onUpdate(CONTACTS_DOCTYPE)
    }
  })

  const value = useMemo(() => {
    return {
      add: add(isInit, scannerT, setIsInit),
      search
    }
  }, [isInit, scannerT])

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export default SearchProvider
