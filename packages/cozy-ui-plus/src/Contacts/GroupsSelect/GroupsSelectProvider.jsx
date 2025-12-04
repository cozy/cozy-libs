import React, { useContext, useState } from 'react'
import { useI18n, useExtendI18n } from 'twake-i18n'

import { translatedDefaultSelectedGroup } from './helpers'
import { locales } from './locales'

const SelectedGroupContext = React.createContext()

export const useSelectedGroup = () => {
  const context = useContext(SelectedGroupContext)

  if (!context) {
    throw new Error(
      'useSelectedGroup must be used within a SelectedGroupProvider'
    )
  }
  return context
}

const SelectedGroupProvider = ({ children }) => {
  useExtendI18n(locales)
  const { t } = useI18n()
  const [selectedGroup, setSelectedGroup] = useState(
    translatedDefaultSelectedGroup(t)
  )

  const contextValue = {
    selectedGroup,
    setSelectedGroup
  }

  return (
    <SelectedGroupContext.Provider value={contextValue}>
      {children}
    </SelectedGroupContext.Provider>
  )
}

export default SelectedGroupProvider
