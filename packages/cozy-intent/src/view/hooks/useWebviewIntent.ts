import { useContext } from 'react'

import { WebviewService } from '../../api'
import { WebviewContext } from '../../view'

export const useWebviewIntent = (): WebviewService | undefined =>
  useContext(WebviewContext)
