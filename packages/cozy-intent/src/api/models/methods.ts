import { AppManifest, FlagshipUI } from '../../api'

type PostMeDefault = Record<string, (...args: unknown[]) => Promise<null>>

type Base64 = string

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
  setDefaultRedirection: (defaultRedirection: string) => Promise<null>
  setFlagshipUI: (flagshipUI: FlagshipUI, caller?: string) => Promise<null>
  showSplashScreen: () => Promise<null>
  toggleSetting: (
    settingName: 'biometryLock' | 'PINLock' | 'autoLock',
    params?: Record<string, unknown>
  ) => Promise<boolean | null>
  isBiometryDenied: () => Promise<boolean>
  isNativePassInstalledOnDevice: () => Promise<boolean>
  scanDocument: () => Promise<Base64 | undefined>
  isScannerAvailable: () => Promise<boolean>
  ocr: (base64: string) => unknown
  isOcrAvailable: () => Promise<boolean>
  openAppOSSettings: () => Promise<null>
}

export type NativeMethodsRegister = _NativeMethodsRegister & PostMeDefault

export type WebviewMethods = Record<string, () => unknown>
