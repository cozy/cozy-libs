import React, { ReactElement, useEffect, useState } from 'react'
import { ChildHandshake, Connection, EventsType, MethodsType } from 'post-me'

import { isFlagshipApp } from 'cozy-device-helper'

import { NativeMethodsRegister } from '../../api/models/methods'
import { Strings } from '../../api/constants'
import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewMessenger } from '../../api/services/WebviewMessenger'
import { WebviewService } from '../../api/services/WebviewService'
import { WebviewWindow } from '../../api/models/environments'

interface Props {
  children: React.ReactChild
}

function isWebviewWindow(window: Window): window is WebviewWindow {
  return (window as WebviewWindow).ReactNativeWebView !== undefined
}

export const WebviewIntentProvider = ({ children }: Props): ReactElement => {
  const [connection, setConnection] =
    useState<
      Connection<MethodsType, EventsType, NativeMethodsRegister, EventsType>
    >()

  useEffect(() => {
    const init = async (): Promise<void> => {
      if (!isWebviewWindow(window)) throw new Error(Strings.flagshipButNoRNAPI)

      const result = await ChildHandshake(new WebviewMessenger(window))

      setConnection(result)
    }

    isFlagshipApp() && init()
  }, [connection])

  if (!isFlagshipApp()) return <>{children}</>

  if (!connection) return <></>

  return (
    <WebviewContext.Provider value={new WebviewService(connection)}>
      {children}
    </WebviewContext.Provider>
  )
}
