export const extractUrl = (url: string): string => {
  if (url.startsWith('http')) {
    const objectUrl = new URL(url)
    return objectUrl.pathname + objectUrl.search + objectUrl.hash
  } else {
    return url
  }
}

export const handleRequestParentOrigin = (event: MessageEvent, origin: string) => {
  // We do not care about message from other origin that our iframe
  if (event.origin !== origin) {
    return
  }

  if (event.source && event.data === 'requestParentOrigin') {
      // @ts-expect-error TS typing is incorrect
      event.source.postMessage('answerParentOrigin', event.origin);
  }
}
