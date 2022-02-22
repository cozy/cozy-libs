import { useContext } from 'react'

import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewService } from '../../api/services/WebviewService'

export const useWebviewIntent = (): WebviewService | void =>
  useContext(WebviewContext)
