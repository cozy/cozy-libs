import { Connection, ChildHandshake, debug } from 'post-me'
import React, { ReactElement, useEffect, useState } from 'react'

import {
  CozyBar,
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

declare const cozy: CozyBar | undefined

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

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const getBarInitAPI = (): ((webviewContext: WebviewService) => void) | void => {
  try {
    if (cozy!.bar && cozy!.bar.setWebviewContext === undefined) {
      return log(strings.errorCozyBarAPIMissing)
    }

    return cozy!.bar!.setWebviewContext
  } catch (err) {
    return undefined
  }
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */
/* eslint-enable no-console */

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
  const setBarWebviewContext = setBarContext || getBarInitAPI()
  const [remoteMethods, setRemoteMethods] = useState<Record<string, boolean>>(
    {}
  )

  useEffect(() => {
    const localMethods = {
      ...methods,
      onInit: (remoteMethods: string): void => {
        setRemoteMethods(JSON.parse(remoteMethods) as Record<string, boolean>)
        methods?.onInit && methods.onInit()
      }
    }

    !connection &&
      !webviewService &&
      isValidEnv() &&
      getConnection(setConnection, localMethods as WebviewMethods).catch(log)
  }, [connection, webviewService, methods])

  useEffect(() => {
    !service && connection && setService(new WebviewService(connection))
  }, [service, connection])

  useEffect(() => {
    setBarWebviewContext && service && setBarWebviewContext(service)
  }, [setBarWebviewContext, service])

  return (
    <WebviewContext.Provider value={{ service, remoteMethods }}>
      {children}
    </WebviewContext.Provider>
  )
}
