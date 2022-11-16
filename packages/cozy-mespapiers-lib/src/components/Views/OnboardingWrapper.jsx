import React from 'react'

import { useOnboarding } from '../Hooks/useOnboarding'

const OnboardingWrapper = () => {
  const { OnboardingComponent } = useOnboarding()

  return <OnboardingComponent />
}

export default OnboardingWrapper
