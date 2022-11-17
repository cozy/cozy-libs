import React from 'react'

import { useOnboarding } from '../Hooks/useOnboarding'

const Onboarding = () => {
  const { OnboardingComponent } = useOnboarding()

  return <OnboardingComponent />
}

export default Onboarding
