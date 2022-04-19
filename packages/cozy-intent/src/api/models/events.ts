export type NativeEvent = {
  nativeEvent: {
    canGoBack?: boolean
    canGoForward?: boolean
    data: string
    loading?: boolean
    lockIdentifier?: number
    title?: string
    url: string
  }
}

export type PostMeMessage = {
  action: string
  args: string
  message?: string
  methodName: string
  requestId: number
  sessionId: number
  type: string
  uri: string
}
