import { Platform } from 'react-native'

export enum FlagshipRoutes {
  Home = 'home',
  Cozyapp = 'cozyapp',
  Authenticate = 'authenticate',
  Onboarding = 'onboarding',
  Stack = 'stack'
}

export interface FlagshipMetadata {
  immersive?: boolean
  navbarHeight?: number
  platform?: typeof Platform
  route?: FlagshipRoutes
  statusBarHeight?: number
  version?: string
}

export const flagshipMetadata = getWindowIfAny()?.cozy?.flagship || {}

export const isFlagshipApp = (): boolean => getWindowIfAny()?.cozy?.flagship !== undefined

/**
 * Check window object existence without raising any error
 */
function getWindowIfAny() {
 return typeof window === 'undefined' ? null : window
}
