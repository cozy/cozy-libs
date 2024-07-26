import { AppManifest, FlagshipUI, PostMeMessageOptions } from '../../api'

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
  setDefaultRedirection: (defaultRedirection: string) => Promise<null>
  setFlagshipUI: (flagshipUI: FlagshipUI, caller?: string) => Promise<null>
  toggleSetting: (
    settingName: 'biometryLock' | 'PINLock' | 'autoLock',
    params?: Record<string, unknown>
  ) => Promise<boolean | null>
  isBiometryDenied: () => Promise<boolean>
  isNativePassInstalledOnDevice: () => Promise<boolean>
  scanDocument: () => Promise<Base64 | undefined>
  isScannerAvailable: () => Promise<boolean>
  ocr: (base64: string) => unknown
  openAppOSSettings: () => Promise<null>
  isAvailable: (featureName: string) => Promise<boolean>
  flagshipLinkRequest: (operation: unknown) => Promise<unknown>
}

export type NativeMethodsRegister = _NativeMethodsRegister & PostMeDefault

type WithOptions<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (options: PostMeMessageOptions, ...args: A) => R
    : never
}

export type NativeMethodsRegisterWithOptions =
  WithOptions<NativeMethodsRegister>

export type WebviewMethods = Record<string, () => unknown>
