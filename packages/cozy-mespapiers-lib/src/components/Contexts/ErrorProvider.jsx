import React, { createContext, useContext, useMemo, useState } from 'react'

import log from 'cozy-logger'

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
    log(
      'critical',
      `Error message: ${errorState.message} || Error stack: ${errorState.stack}`
    )
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
