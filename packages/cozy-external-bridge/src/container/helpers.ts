export const extractUrl = (url: string): string => {
  if (url.startsWith('http')) {
    const objectUrl = new URL(url)
    return objectUrl.pathname + objectUrl.search + objectUrl.hash
  } else {
    return url
  }
}
