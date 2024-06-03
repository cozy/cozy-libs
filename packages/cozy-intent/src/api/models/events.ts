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

export type PostMeMessageOptions = {
  slug: string
}

export type PostMeMessage = {
  action: string
  args: unknown[]
  message?: string
  methodName: string
  requestId: number
  sessionId: number
  type: string
  uri: string
}
