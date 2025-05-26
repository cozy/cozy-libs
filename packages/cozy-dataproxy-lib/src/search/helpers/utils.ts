import flag from 'cozy-flags'

export const isDebug = (): boolean => {
  return Boolean(flag('debug'))
}
