import { AppManifest, FlagshipUI } from '../../api'

export type NativeMethodsRegister = {
  backToHome: () => void
  hideSplashScreen: () => void
  logout: () => void
  openApp: (href: string, app: AppManifest, iconParams?: DOMRect) => void
  setFlagshipUI: (flagshipUI: FlagshipUI, caller?: string) => void
  showSplashScreen: () => void
}

export type WebviewMethods = Record<string, () => unknown>
