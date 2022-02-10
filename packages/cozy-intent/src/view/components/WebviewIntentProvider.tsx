import React, { ReactElement, useEffect, useState } from 'react'
import { Connection, ChildHandshake } from 'post-me'

import { isFlagshipApp } from 'cozy-device-helper'

import { CozyBar } from '../../api/models/applications'
import { strings } from '../../api/constants'
import { TypeguardService } from '../../api/services/TypeguardService'
import { WebviewConnection } from '../../api/models/environments'
import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewMessenger } from '../../api/services/WebviewMessenger'
import { WebviewService } from '../../api/services/WebviewService'

declare const cozy: CozyBar | undefined

interface Props {
  children?: React.ReactChild
  webviewService?: WebviewService
}

const getBarInitAPI = ():
  | ((webviewContext: WebviewService) => void)
  | undefined => {
  try {
    return cozy?.bar?.setWebviewContext
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error((err as Error).stack)

    // If we fail to get the cozy-bar, we want to assume it doesn't exist
    return undefined
  }
}

const sendSyncMessage = (message: string): void => {
  if (!TypeguardService.hasReactNativeAPI(window))
    throw new Error(strings.noRNAPIFound)

  return window.ReactNativeWebView.postMessage(
    JSON.stringify({
      signature: strings.postMeSignature,
      uri: window.location.hostname,
      message
    })
  )
}

const getConnection = async (
  callBack: (connection: Connection) => void
): Promise<void> => {
  if (!TypeguardService.isWebviewWindow(window))
    throw new Error(strings.flagshipButNoRNAPI)

  sendSyncMessage(strings.webviewIsRendered)

  const result = await ChildHandshake(new WebviewMessenger(window))

  callBack(result)
}

export const WebviewIntentProvider = ({
  children,
  webviewService
}: Props): ReactElement => {
  const [connection, setConnection] = useState<WebviewConnection>()
  const [service, setService] = useState<WebviewService | void>(webviewService)
  const setBarWebviewContext = getBarInitAPI()

  useEffect(() => {
    !connection &&
      !webviewService &&
      isFlagshipApp() &&
      getConnection(setConnection)
  }, [connection, webviewService])

  useEffect(() => {
    !service && connection && setService(new WebviewService(connection))
  }, [service, connection])

  useEffect(() => {
    setBarWebviewContext && service && setBarWebviewContext(service)
  }, [setBarWebviewContext, service])

  return (
    <WebviewContext.Provider value={service}>
      {children}
    </WebviewContext.Provider>
  )
}
