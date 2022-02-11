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

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const getBarInitAPI = (): ((webviewContext: WebviewService) => void) | void => {
  try {
    if (cozy!.bar!.setWebviewContext === undefined) {
      return console.warn(strings.errorCozyBarAPIMissing)
    }

    return cozy!.bar!.setWebviewContext
  } catch (err) {
    console.warn((err as Error).stack)

    return console.warn(strings.errorGetCozyBarAPI)
  }
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */
/* eslint-enable no-console */

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
