import React, { createContext } from 'react'

const IntentProviderContext = createContext()

/**
 * @param {object} param
 * @param {JSX.Element} param.children
 * @param {object=} param.intentData
 * @param {string=} param.intentId
 * @returns
 */
export const IntentProvider = ({ children, intentData, intentId }) => {
  return (
    <IntentProviderContext.Provider value={{ intentData, intentId }}>
      {children}
    </IntentProviderContext.Provider>
  )
}

export const useIntentProviderData = () => {
  const intentProviderData = React.useContext(IntentProviderContext)
  if (!intentProviderData) {
    throw new Error(
      'useIntentProviderData must be used within a IntentProvider'
    )
  }

  return intentProviderData
}
