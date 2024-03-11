import React from 'react'

import { NativeService } from '../../api'

// React typings are out of date here
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const NativeContext = React.createContext<NativeService | void>(
  undefined
)
