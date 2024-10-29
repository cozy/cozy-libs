declare module 'cozy-ui/transpiled/react/*' {
  interface UiProps {
    className?: string
    children?: React.ReactNode
    [key: string]: unknown
  }

  const element: (props: UiProps) => JSX.Element
  export default element

  export const useI18n: () => {
    t: (key: string, vars?: Record<string, unknown>) => string
  }

  export const useCozyDialog: (arg: string) => {
    open: (
      component: React.ReactNode,
      options?: Record<string, unknown>
    ) => void
    close: () => void
  }

  export const BreakpointsProvider: React.FC
}
