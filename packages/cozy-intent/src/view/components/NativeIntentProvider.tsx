import React, { ReactElement } from 'react'

import { NativeContext } from '../../view'
import { NativeMethodsRegister, NativeService } from '../../api'

interface Props {
  children: React.ReactChild
  localMethods: NativeMethodsRegister
}

let nativeIntentService: NativeService | undefined

export const getNativeIntentService = (): NativeService => {
  if (!nativeIntentService) {
    throw new Error(
      'nativeIntentService has not been instantiated in a NativeIntentProvider'
    )
  }

  return nativeIntentService
}

export const NativeIntentProvider = ({
  children,
  localMethods
}: Props): ReactElement => {
  nativeIntentService = new NativeService(localMethods)

  return (
    <NativeContext.Provider value={nativeIntentService}>
      {children}
    </NativeContext.Provider>
  )
}
