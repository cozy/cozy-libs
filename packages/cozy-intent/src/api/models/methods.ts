import { AppManifest, FlagshipUI } from '../../api'

export type NativeMethodsRegister = {
  backToHome: () => Promise<null>
  hideSplashScreen: () => Promise<null>
  logout: () => Promise<null>
  openApp: (
    href: string,
    app: AppManifest,
    iconParams?: DOMRect
  ) => Promise<null>
  openSettingBiometry: () => Promise<boolean>
  setFlagshipUI: (flagshipUI: FlagshipUI, caller?: string) => Promise<null>
  showSplashScreen: () => Promise<null>
}

export type WebviewMethods = Record<string, () => unknown>
