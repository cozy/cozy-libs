import { useContext } from 'react'

import { WebviewService } from '../../api'
import { WebviewContext } from '../../view'

export const useWebviewIntent = (): WebviewService | undefined => {
  const context = useContext(WebviewContext)
  return context?.service
}

export const useRemoteMethods = (): Record<string, boolean> | undefined => {
  const context = useContext(WebviewContext)
  return context?.remoteMethods
}
