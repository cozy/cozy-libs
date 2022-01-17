import React, { ReactElement } from 'react'

import { NativeContext } from '../contexts/NativeContext'
import { NativeMethodsRegister } from '../../api/models/methods'
import { NativeService } from '../../api/services/NativeService'

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
