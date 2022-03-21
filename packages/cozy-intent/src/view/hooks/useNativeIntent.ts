import { useContext } from 'react'

import { NativeContext } from '@view'
import { NativeService, strings } from '@api'

export const useNativeIntent = (): NativeService => {
  const context = useContext(NativeContext)

  if (!context) throw new Error(strings.nativeNoProviderFound)

  return context
}
