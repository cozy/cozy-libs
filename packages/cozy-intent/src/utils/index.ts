import logger from 'cozy-logger'

export const interpolate = (
  str: string,
  params: Record<string, string>
): string => {
  if (!params) return str

  const names = Object.keys(params)
  const vals = Object.values(params)

  // I do not see security risks here, we're not executing user input
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const makeInterpolate = new Function(...names, `return \`${str}\`;`)

  try {
    return makeInterpolate(...vals) as string
  } catch (error) {
    // String template and params did not match
    return str
  }
}

export const log = logger.namespace('cozy-intent')

declare const __DEV__: boolean
export const isNativeDevMode = (): boolean => {
  try {
    return !!__DEV__
  } catch {
    return false
  }
}
