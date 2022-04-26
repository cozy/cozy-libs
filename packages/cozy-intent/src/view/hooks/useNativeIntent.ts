import { useContext } from 'react'

import { NativeContext } from '../../view'
import { NativeService } from '../../api'

export const useNativeIntent = (): void | NativeService =>
  useContext(NativeContext)
