import React from 'react'

import { WebviewService } from '../../api/services/WebviewService'

export const WebviewContext = React.createContext<WebviewService | void>(
  undefined
)
