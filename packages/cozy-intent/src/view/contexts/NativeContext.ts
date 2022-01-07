import React from 'react'

import { NativeService } from '../../api/services/NativeService'

export const NativeContext = React.createContext<NativeService | void>(
  undefined
)
