import React, { useState, useEffect, createContext, useContext } from 'react'

import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'

const NativeFileSharingContext = createContext()

export const useNativeFileSharing = () => {
  const context = useContext(NativeFileSharingContext)

  if (!context) {
    throw new Error('useFileSharing must be used within a FileSharingProvider')
  }
  return context
}

export const NativeFileSharingProvider = ({ children }) => {
  const webviewIntent = useWebviewIntent()

  const [isNativeFileSharingAvailable, setIsNativeFileSharingAvailable] =
    useState(false)

  useEffect(() => {
    const checkNativeFileSharingAvailability = async () => {
      const availability =
        isFlagshipApp() &&
        (await webviewIntent.call('isAvailable', 'shareFiles'))

      setIsNativeFileSharingAvailable(availability)
    }
    checkNativeFileSharingAvailability()
  }, [webviewIntent])

  const shareFilesNative = async filesIds => {
    return await webviewIntent.call('shareFiles', filesIds)
  }

  return (
    <NativeFileSharingContext.Provider
      value={{ isNativeFileSharingAvailable, shareFilesNative }}
    >
      {children}
    </NativeFileSharingContext.Provider>
  )
}

export default NativeFileSharingProvider
