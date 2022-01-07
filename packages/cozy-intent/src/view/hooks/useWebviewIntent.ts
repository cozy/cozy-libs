import { useContext } from 'react'

import { WebviewService } from '../../api/services/WebviewService'
import { WebviewContext } from '../contexts/WebviewContext'
import { Strings } from '../../api/constants'

export const useWebviewIntent = (): WebviewService => {
  const context = useContext(WebviewContext)

  if (!context) throw new Error(Strings.webviewNoProviderFound)

  return context
}
