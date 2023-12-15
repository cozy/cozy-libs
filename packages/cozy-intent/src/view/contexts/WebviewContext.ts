import React from 'react'

import { WebviewService } from '../../api'

export const WebviewContext = React.createContext<
  | { service?: WebviewService; remoteMethods?: Record<string, boolean> }
  | undefined
>(undefined)
