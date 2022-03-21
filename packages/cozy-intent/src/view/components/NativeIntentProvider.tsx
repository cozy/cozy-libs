import React, { ReactElement } from 'react'

import { NativeContext } from '@view'
import { NativeMethodsRegister, NativeService } from '@api'

interface Props {
  children: React.ReactChild
  localMethods: NativeMethodsRegister
}

export const NativeIntentProvider = ({
  children,
  localMethods
}: Props): ReactElement => (
  <NativeContext.Provider value={new NativeService(localMethods)}>
    {children}
  </NativeContext.Provider>
)
