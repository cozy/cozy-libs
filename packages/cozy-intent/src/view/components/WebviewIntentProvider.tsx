import React, { ReactElement, useEffect, useState } from 'react'
import { ChildHandshake, Connection, EventsType, MethodsType } from 'post-me'

import { isFlagshipApp } from 'cozy-device-helper'

import { NativeMethodsRegister } from '../../api/models/methods'
import { StaticService } from '../../api/services/StaticService'
import { Strings } from '../../api/constants'
import { TypeguardService } from '../../api/services/TypeguardService'
import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewMessenger } from '../../api/services/WebviewMessenger'
import { WebviewService } from '../../api/services/WebviewService'

interface Props {
  children?: React.ReactChild
  webviewService?: WebviewService
}

export const WebviewIntentProvider = ({
  children,
  webviewService
}: Props): ReactElement => {
  const [connection, setConnection] =
    useState<
      Connection<MethodsType, EventsType, NativeMethodsRegister, EventsType>
    >()

  useEffect(() => {
    if (connection) return

    const init = async (): Promise<void> => {
      if (!TypeguardService.isWebviewWindow(window))
        throw new Error(Strings.flagshipButNoRNAPI)

      StaticService.sendSyncMessage(Strings.webviewIsRendered)
      const result = await ChildHandshake(new WebviewMessenger(window))
      setConnection(result)
    }

    !webviewService && isFlagshipApp() && init()
  }, [connection, webviewService])

  if (!isFlagshipApp()) return <>{children}</>

  return (
    <WebviewContext.Provider
      value={webviewService || (connection && new WebviewService(connection))}
    >
      {children}
    </WebviewContext.Provider>
  )
}
