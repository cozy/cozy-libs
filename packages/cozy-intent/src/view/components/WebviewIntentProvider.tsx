import React, { ReactElement, useEffect, useState } from 'react'

import { isFlagshipApp } from 'cozy-device-helper'

import { CozyBar } from '../../api/models/applications'
import { StaticService } from '../../api/services/StaticService'
import { WebviewConnection } from '../../api/models/environments'
import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewService } from '../../api/services/WebviewService'

declare let cozy: CozyBar | undefined

interface Props {
  children?: React.ReactChild
  webviewService?: WebviewService
}

export const WebviewIntentProvider = ({
  children,
  webviewService
}: Props): ReactElement => {
  const [connection, setConnection] = useState<WebviewConnection>()
  const [service, setService] = useState<WebviewService | void>(webviewService)
  const setBarWebviewContext = cozy?.bar?.setWebviewContext

  useEffect(() => {
    !webviewService &&
      isFlagshipApp() &&
      StaticService.getConnection(setConnection)
  }, [webviewService])

  useEffect(() => {
    connection && setService(new WebviewService(connection))
  }, [connection])

  useEffect(() => {
    setBarWebviewContext && service && setBarWebviewContext(service)
  }, [setBarWebviewContext, service])

  return (
    <WebviewContext.Provider value={service}>
      {children}
    </WebviewContext.Provider>
  )
}
