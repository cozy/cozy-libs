import React from 'react'

import { WebviewService } from '../../api'

export const WebviewContext = React.createContext<WebviewService | undefined>(
  undefined
)
