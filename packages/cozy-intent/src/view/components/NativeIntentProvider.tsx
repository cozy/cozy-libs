import React, { ReactElement, useEffect, useRef } from 'react'

import { NativeMethodsRegister, NativeService } from '../../api'
import { NativeContext } from '../../view'

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

/**
 * `localMethods` can be updated at any time, it will not trigger a re-render of the context provider
 */
export const NativeIntentProvider = ({
  children,
  localMethods
}: Props): ReactElement => {
  const hasRendered = useRef(false)

  useEffect(() => {
    if (!hasRendered.current) {
      nativeIntentService = new NativeService(localMethods)
      hasRendered.current = true
    }

    nativeIntentService?.updateLocalMethods(localMethods)
  }, [localMethods])

  return (
    <NativeContext.Provider value={nativeIntentService}>
      {children}
    </NativeContext.Provider>
  )
}
