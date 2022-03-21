import { useContext } from 'react'

import { WebviewContext } from '@view'
import { WebviewService } from '@api'

export const useWebviewIntent = (): WebviewService | undefined =>
  useContext(WebviewContext)
