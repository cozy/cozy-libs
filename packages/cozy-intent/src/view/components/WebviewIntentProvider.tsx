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
  children: React.ReactChild
}

export const WebviewIntentProvider = ({ children }: Props): ReactElement => {
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
