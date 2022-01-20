import { AppManifest } from './applications'

export type NativeMethodsRegister = {
  logout: () => Promise<void>
  openApp: (href: string, app: AppManifest) => Promise<void>
}
