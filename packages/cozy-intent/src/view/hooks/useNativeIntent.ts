import { useContext } from 'react'

import { NativeService } from '../../api/services/NativeService'
import { NativeContext } from '../contexts/NativeContext'
import { Strings } from '../../api/constants'

export const useNativeIntent = (): NativeService => {
  const context = useContext(NativeContext)

  if (!context) throw new Error(Strings.nativeNoProviderFound)

  return context
}
