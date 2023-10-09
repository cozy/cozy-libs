import { debug } from 'post-me'
import React, { ReactElement, useEffect, useRef } from 'react'

import { NativeMethodsRegister, NativeService } from '../../api'
import { NativeContext } from '../../view'

const log = debug('NativeIntentProvider')

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

const setNativeIntentService = (service: NativeService): void => {
  nativeIntentService = service
}

export const NativeIntentProvider = ({
  children,
  localMethods
}: Props): ReactElement => {
  // Use useRef to hold the service instance in a way that does not trigger re-renders
  const serviceRef = useRef<NativeService | null>(null)

  if (serviceRef.current === null) {
    serviceRef.current = new NativeService(localMethods)
    setNativeIntentService(serviceRef.current)
  }

  useEffect(() => {
    // Always update methods since either they've changed, or this is the first run
    log('Updating localMethods on nativeIntentService')
    serviceRef.current?.updateLocalMethods(localMethods)
  }, [localMethods])

  return (
    <NativeContext.Provider value={serviceRef.current}>
      {children}
    </NativeContext.Provider>
  )
}
