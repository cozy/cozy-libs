import { useContext } from 'react'

import { WebviewContext } from '../../view'
import { WebviewService } from '../../api'

export const useWebviewIntent = (): WebviewService | undefined => {
  const context = useContext(WebviewContext)

  if (!context) {
    throw new Error(
      'useWebviewIntent must be used within a WebviewIntentProvider'
    )
  }
  return context
}
