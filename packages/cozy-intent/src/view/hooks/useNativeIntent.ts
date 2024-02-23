import { useContext } from 'react'

import { NativeService } from '../../api'
import { NativeContext } from '../../view'

// React typings are out of date here
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const useNativeIntent = (): void | NativeService =>
  useContext(NativeContext)
