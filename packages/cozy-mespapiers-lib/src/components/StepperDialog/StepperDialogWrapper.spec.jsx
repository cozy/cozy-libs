import { render } from '@testing-library/react'
import React from 'react'

import StepperDialogWrapper from './StepperDialogWrapper'
import AppLike from '../../../test/components/AppLike'
import { useStepperDialog } from '../Hooks/useStepperDialog'

/* eslint-disable react/display-name */
jest.mock('../ModelSteps/Scan/ScanWrapper', () => () => (
  <div data-testid="ScanWrapper" />
))
jest.mock('../ModelSteps/InformationDialog', () => () => (
  <div data-testid="InformationDialog" />
))
jest.mock('../ModelSteps/ContactDialog', () => () => (
  <div data-testid="ContactDialog" />
))
jest.mock('../Hooks/useStepperDialog')
/* eslint-enable react/display-name */

const mockAllCurrentSteps = [
  { stepIndex: 1, model: 'Scan' },
  { stepIndex: 2, model: 'Information' },
  { stepIndex: 3, model: 'Contact' }
]

describe('StepperDialogWrapper', () => {
  const setup = () => {
    return render(
      <AppLike>
        <StepperDialogWrapper />
      </AppLike>
    )
  }

  it('should contain only Scan component', () => {
    useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 1
    })
    const { queryByTestId } = setup()

    expect(queryByTestId('ScanWrapper')).toBeTruthy()
    expect(queryByTestId('InformationDialog')).toBeNull()
    expect(queryByTestId('ContactDialog')).toBeNull()
  })

  it('should contain only InformationDialog component', () => {
    useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 2
    })
    const { queryByTestId } = setup()

    expect(queryByTestId('InformationDialog')).toBeTruthy()
    expect(queryByTestId('ScanWrapper')).toBeNull()
    expect(queryByTestId('ContactDialog')).toBeNull()
  })

  it('should contain only Contact component', () => {
    useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 3
    })
    const { queryByTestId } = setup()

    expect(queryByTestId('ContactDialog')).toBeTruthy()
    expect(queryByTestId('ScanWrapper')).toBeNull()
    expect(queryByTestId('InformationDialog')).toBeNull()
  })
})
