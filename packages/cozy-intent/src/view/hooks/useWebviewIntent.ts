import { useContext } from 'react'

import { isFlagshipApp } from 'cozy-device-helper'

import { strings } from '../../api/constants'
import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewService } from '../../api/services/WebviewService'

export const useWebviewIntent = (): WebviewService | void => {
  const context = useContext(WebviewContext)

  if (isFlagshipApp() && !context)
    throw new Error(strings.webviewNoProviderFound)

  return context
}
