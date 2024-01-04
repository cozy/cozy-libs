import { isFlagshipUI } from '../api'

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

declare const __DEV__: boolean
export const isNativeDevMode = (): boolean => {
  try {
    return !!__DEV__
  } catch {
    return false
  }
}

declare const __DEVELOPMENT__: boolean
export const isWebDevMode = (): boolean => {
  try {
    return !!__DEVELOPMENT__
  } catch {
    return false
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  return String(error)
}

interface WithComponentId {
  componentId: string
}

export const isFlagshipUiArgsArray = (
  item: unknown
): item is WithComponentId[] => {
  return Array.isArray(item) && isFlagshipUI(item[0])
}

export const isThemeArg = (item: unknown): item is string => {
  return typeof item === 'string'
}
