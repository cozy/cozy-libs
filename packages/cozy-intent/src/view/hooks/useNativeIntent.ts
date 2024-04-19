import { useContext } from 'react'

import { NativeService } from '../../api'
import { NativeContext } from '../../view'

export const useNativeIntent = (): void | NativeService =>
  useContext(NativeContext)
