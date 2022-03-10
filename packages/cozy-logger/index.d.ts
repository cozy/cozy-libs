declare module 'cozy-logger' {
  declare function log(
    type: 'debug' | 'info' | 'warn' | 'error' | 'ok' | 'critical',
    message: string,
    label?: string,
    namespace?: string
  ): void

  declare namespace log {
    export const addFilter: (filter: unknown) => number

    export const namespace: (
      namespace: string
    ) => (type: string, message: string, label?: string, ns?: string) => void

    export const setNoRetry: (obj: unknown) => unknown

    export const setLevel: (lvl: unknown) => void
  }

  export default log
}
