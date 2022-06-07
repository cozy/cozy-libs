import { useContext } from 'react'

import { NativeContext } from '../../view'
import { NativeService } from '../../api'

export const useNativeIntent = (): void | NativeService => {
  const context = useContext(NativeContext)

  if (!context) {
    throw new Error('NativeContext must be used within a NativeIntentProvider')
  }
  return context
}
