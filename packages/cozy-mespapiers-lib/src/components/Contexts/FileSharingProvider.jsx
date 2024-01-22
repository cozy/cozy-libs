import React, { useState, useEffect, createContext, useContext } from 'react'

import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'

const FileSharingContext = createContext()

export const useFileSharing = () => {
  const context = useContext(FileSharingContext)

  if (!context) {
    throw new Error('useFileSharing must be used within a FileSharingProvider')
  }
  return context
}

export const FileSharingProvider = ({ children }) => {
  const webviewIntent = useWebviewIntent()

  const [isFileSharingAvailable, setIsFileSharingAvailable] = useState(false)

  useEffect(() => {
    const checkFileSharingAvailability = async () => {
      const availability =
        isFlagshipApp() &&
        (await webviewIntent.call('isAvailable', 'shareFiles'))

      setIsFileSharingAvailable(availability)
    }
    checkFileSharingAvailability()
  }, [webviewIntent])

  const shareFiles = async filesIds => {
    return await webviewIntent.call('shareFiles', filesIds)
  }

  return (
    <FileSharingContext.Provider value={{ isFileSharingAvailable, shareFiles }}>
      {children}
    </FileSharingContext.Provider>
  )
}

export default FileSharingProvider
