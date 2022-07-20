import { useContext } from 'react'

import OnboardingContext from '../Contexts/OnboardingProvider'

export const useOnboarding = () => {
  const onboarding = useContext(OnboardingContext)
  if (!onboarding) {
    throw new Error(
      'OnboardingContext must be used within a OnboardingProvider'
    )
  }

  return onboarding
}
