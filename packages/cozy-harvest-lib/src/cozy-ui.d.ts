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
}
