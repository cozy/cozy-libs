export type NativeMethodsRegister = {
  logout: () => Promise<void>
  openApp: (href: string) => Promise<void>
}
