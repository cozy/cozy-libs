import React, { createContext, useContext, useMemo, useState } from 'react'

import minilog from 'cozy-minilog'

const log = minilog('ErrorProvider')

const ErrorContext = createContext()

const ErrorProvider = ({ children }) => {
  const [errorState, setErrorState] = useState(null)

  const value = useMemo(() => {
    return {
      error: errorState,
      hasError: !!errorState,
      setError: setErrorState
    }
  }, [errorState])

  if (errorState) {
    log.error('Error message', errorState)
  }

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

export default ErrorContext

export const useError = () => {
  const errorContext = useContext(ErrorContext)
  if (!errorContext) {
    throw new Error('useError must be used within a ErrorProvider')
  }
  return errorContext
}

export { ErrorProvider }
