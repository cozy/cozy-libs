import React, { createContext } from 'react'

const OnboardingContext = createContext()

const OnboardingProvider = ({ children, OnboardingComponent }) => {
  return (
    <OnboardingContext.Provider value={{ OnboardingComponent }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export default OnboardingContext

export { OnboardingProvider }
