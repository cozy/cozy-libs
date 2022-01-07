import React, { ReactElement } from 'react'

import { NativeContext } from '../contexts/NativeContext'
import { NativeService } from '../../api/services/NativeService'

interface Props {
  children: React.ReactChild
}

export const NativeIntentProvider = ({ children }: Props): ReactElement => (
  <NativeContext.Provider value={new NativeService()}>
    {children}
  </NativeContext.Provider>
)
