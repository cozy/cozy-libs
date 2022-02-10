import { useContext } from 'react'

import { NativeService } from '../../api/services/NativeService'
import { NativeContext } from '../contexts/NativeContext'
import { strings } from '../../api/constants'

export const useNativeIntent = (): NativeService => {
  const context = useContext(NativeContext)

  if (!context) throw new Error(strings.nativeNoProviderFound)

  return context
}
