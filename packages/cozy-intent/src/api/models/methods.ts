import { AppManifest, FlagshipUI } from '../../api'

type PostMeDefault = Record<string, (...args: unknown[]) => Promise<null>>

interface _NativeMethodsRegister {
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
  toggleSetting: (
    settingName: 'biometryLock' | 'PINLock' | 'autoLock',
    params?: Record<string, unknown>
  ) => Promise<boolean | null>
}

export type NativeMethodsRegister = _NativeMethodsRegister & PostMeDefault

export type WebviewMethods = Record<string, () => unknown>
