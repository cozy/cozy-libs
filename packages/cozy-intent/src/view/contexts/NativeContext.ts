import React from 'react'

import { NativeService } from '../../api'

export const NativeContext = React.createContext<NativeService | void>(
  undefined
)
