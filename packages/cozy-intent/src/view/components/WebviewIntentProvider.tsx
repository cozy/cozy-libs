import { Connection, ChildHandshake, debug } from 'post-me'
import React, { ReactElement, useEffect, useState } from 'react'

import {
  WebviewConnection,
  WebviewMessenger,
  WebviewService,
  WebviewWindow,
  strings,
  DebugWebviewMessenger,
  WebviewMethods
} from '../../api'
import { isWebDevMode } from '../../utils'
import { WebviewContext } from '../../view'

const log = debug('WebviewIntentProvider')

interface Props {
  children?: React.ReactChild
  methods?: WebviewMethods
  setBarContext?: (webviewContext: WebviewService) => void
  webviewService?: WebviewService
}

const assumeWebviewWindow = window as unknown as WebviewWindow

function isWebviewWindow(window: Window): window is WebviewWindow {
  return (window as WebviewWindow).ReactNativeWebView !== undefined
}

const sendSyncMessage = (message: string): void => {
  return assumeWebviewWindow.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: strings.postMeSignature,
      message
    })
  )
}

const getConnection = async (
  callBack: (connection: Connection) => void,
  methods?: WebviewMethods
): Promise<void> => {
  sendSyncMessage(strings.webviewIsRendered)

  const messenger = new WebviewMessenger(assumeWebviewWindow)

  const result = await ChildHandshake(
    isWebDevMode() ? DebugWebviewMessenger(messenger) : messenger,
    methods
  )

  callBack(result)
}

const isValidEnv = (): boolean => {
  const flagshipApp = assumeWebviewWindow.cozy?.flagship

  if (!flagshipApp) return false

  if (!isWebviewWindow(window)) {
    log(strings.flagshipButNoRNAPI)

    return false
  }

  return true
}

export const WebviewIntentProvider = ({
  children,
  methods,
  setBarContext,
  webviewService
}: Props): ReactElement => {
  const [connection, setConnection] = useState<WebviewConnection>()
  const [service, setService] = useState<WebviewService | undefined>(
    webviewService
  )

  useEffect(() => {
    !connection &&
      !webviewService &&
      isValidEnv() &&
      getConnection(setConnection, methods).catch(log)
  }, [connection, webviewService, methods])

  useEffect(() => {
    !service && connection && setService(new WebviewService(connection))
  }, [service, connection])

  useEffect(() => {
    setBarContext && service && setBarContext(service)
  }, [setBarContext, service])

  return (
    <WebviewContext.Provider value={service}>
      {children}
    </WebviewContext.Provider>
  )
}
