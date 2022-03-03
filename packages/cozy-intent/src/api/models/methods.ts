import { AppManifest } from './applications'

export type NativeMethodsRegister = {
  backToHome: () => void
  logout: () => Promise<void>
  openApp: (href: string, app: AppManifest) => Promise<void>
  setNavBarColor: (color: string) => void
  setStatusBarColor: (color: string) => void
  hideSplashScreen: () => void
  showSplashScreen: () => void
}
