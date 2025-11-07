export const getIframe = (): HTMLIFrameElement => {
  const iframe = document.getElementById(
    'embeddedApp'
  ) as HTMLIFrameElement | null

  if (iframe === null) {
    throw new Error('No iframe found')
  }

  return iframe
}

export const extractUrl = (url: string): string => {
  if (url.startsWith('http')) {
    const objectUrl = new URL(url)
    return objectUrl.pathname + objectUrl.search + objectUrl.hash
  } else {
    return url
  }
}

export const handleParentOriginRequest = (
  event: MessageEvent,
  url: string
): void => {
  // We do not care about message from other origin that our iframe
  const urlOrigin = new URL(url).origin

  if (event.origin !== urlOrigin) {
    return
  }

  if (event.source && event.data === 'requestParentOrigin') {
    // @ts-expect-error TS typing is incorrect
    event.source.postMessage('answerParentOrigin', event.origin)
  }
}
