import '@testing-library/jest-dom'
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
  const setup = ({
    allCurrentSteps = mockAllCurrentSteps,
    currentStepIndex
  }) => {
    useStepperDialog.mockReturnValue({
      allCurrentSteps,
      currentStepIndex
    })

    return render(
      <AppLike>
        <StepperDialogWrapper />
      </AppLike>
    )
  }

  it('should contain only Scan component', () => {
    const { getByTestId, queryByTestId } = setup({
      currentStepIndex: 1
    })

    expect(getByTestId('ScanWrapper')).toBeInTheDocument()
    expect(queryByTestId('InformationDialog')).toBeNull()
    expect(queryByTestId('ContactDialog')).toBeNull()
  })

  it('should contain only InformationDialog component', () => {
    const { getByTestId, queryByTestId } = setup({
      currentStepIndex: 2
    })

    expect(getByTestId('InformationDialog')).toBeInTheDocument()
    expect(queryByTestId('ScanWrapper')).toBeNull()
    expect(queryByTestId('ContactDialog')).toBeNull()
  })

  it('should contain only Contact component', () => {
    const { getByTestId, queryByTestId } = setup({
      currentStepIndex: 3
    })

    expect(getByTestId('ContactDialog')).toBeInTheDocument()
    expect(queryByTestId('ScanWrapper')).toBeNull()
    expect(queryByTestId('InformationDialog')).toBeNull()
  })
})
