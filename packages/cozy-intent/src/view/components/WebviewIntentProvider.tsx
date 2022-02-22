import React, { ReactElement, useEffect, useState } from 'react'
import { Connection, ChildHandshake } from 'post-me'

import { isFlagshipApp } from 'cozy-device-helper'

import { CozyBar } from '../../api/models/applications'
import { WebviewConnection, WebviewWindow } from '../../api/models/environments'
import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewMessenger } from '../../api/services/WebviewMessenger'
import { WebviewService } from '../../api/services/WebviewService'
import { strings } from '../../api/constants'

declare const cozy: CozyBar | undefined

interface Props {
  children?: React.ReactChild
  webviewService?: WebviewService
}

const assumeWebviewWindow = window as unknown as WebviewWindow

function isWebviewWindow(window: Window): window is WebviewWindow {
  return (window as WebviewWindow).ReactNativeWebView !== undefined
}

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const getBarInitAPI = (): ((webviewContext: WebviewService) => void) | void => {
  try {
    if (cozy!.bar && cozy!.bar.setWebviewContext === undefined) {
      return console.warn(strings.errorCozyBarAPIMissing)
    }

    return cozy!.bar!.setWebviewContext
  } catch (err) {
    return console.warn(strings.errorGetCozyBarAPI)
  }
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */
/* eslint-enable no-console */

const sendSyncMessage = (message: string): void => {
  return assumeWebviewWindow.ReactNativeWebView.postMessage(
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
  sendSyncMessage(strings.webviewIsRendered)

  const result = await ChildHandshake(new WebviewMessenger(assumeWebviewWindow))

  callBack(result)
}

const isValidEnv = (): boolean => {
  const flagshipApp = isFlagshipApp()

  if (!flagshipApp) return false

  if (!isWebviewWindow(window)) throw new Error(strings.flagshipButNoRNAPI)

  return flagshipApp
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
      isValidEnv() &&
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
