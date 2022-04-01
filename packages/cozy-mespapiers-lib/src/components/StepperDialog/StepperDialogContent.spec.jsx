import React from 'react'
import { render } from '@testing-library/react'

import AppLike from 'test/components/AppLike'
import StepperDialogContent from 'src/components/StepperDialog/StepperDialogContent'
import { useStepperDialog } from 'src/components/Hooks/useStepperDialog'

/* eslint-disable react/display-name */
jest.mock('src/components/ModelSteps/Scan', () => () => (
  <div data-testid="Scan" />
))
jest.mock('src/components/ModelSteps/Information', () => () => (
  <div data-testid="Information" />
))
jest.mock('src/components/ModelSteps/Contact', () => () => (
  <div data-testid="Contact" />
))
jest.mock('src/components/Hooks/useStepperDialog')
/* eslint-enable react/display-name */

const mockAllCurrentSteps = [
  { stepIndex: 1, model: 'Scan' },
  { stepIndex: 2, model: 'Information' },
  { stepIndex: 3, model: 'Contact' }
]

describe('StepperDialogContent', () => {
  const setup = () => {
    return render(
      <AppLike>
        <StepperDialogContent />
      </AppLike>
    )
  }

  it('should contain only Scan component', () => {
    useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 1
    })
    const { queryByTestId } = setup()

    expect(queryByTestId('Scan')).toBeTruthy()
    expect(queryByTestId('Information')).toBeNull()
    expect(queryByTestId('Contact')).toBeNull()
  })

  it('should contain only Information component', () => {
    useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 2
    })
    const { queryByTestId } = setup()

    expect(queryByTestId('Information')).toBeTruthy()
    expect(queryByTestId('scan')).toBeNull()
    expect(queryByTestId('Contact')).toBeNull()
  })

  it('should contain only Contact component', () => {
    useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 3
    })
    const { queryByTestId } = setup()

    expect(queryByTestId('Contact')).toBeTruthy()
    expect(queryByTestId('Scan')).toBeNull()
    expect(queryByTestId('Information')).toBeNull()
  })
})
