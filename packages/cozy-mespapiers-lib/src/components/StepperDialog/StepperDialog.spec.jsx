import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import StepperDialog from 'src/components/StepperDialog/StepperDialog'

/* eslint-disable react/display-name */
jest.mock('cozy-ui/transpiled/react/hooks/useBreakpoints', () =>
  jest.fn(() => ({ isMobile: false }))
)

jest.mock('cozy-ui/transpiled/react/Dialog', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/Dialog'),
  __esModule: true,
  default: 'MUIDialog'
}))

jest.mock('cozy-ui/transpiled/react/CozyDialogs', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/CozyDialogs'),
  DialogBackButton: ({ onClick }) => (
    <div data-testid="DialogBackButton" onClick={onClick} />
  ),
  DialogCloseButton: ({ onClick }) => (
    <div data-testid="DialogCloseButton" onClick={onClick} />
  )
}))
/* eslint-enable react/display-name */

describe('StepperDialog', () => {
  it('should display "stepper" content', () => {
    const { getByText } = render(<StepperDialog stepper={'1/2'} />)

    expect(getByText('1/2')).toBeTruthy()
  })

  describe('DialogCloseButton', () => {
    const closeAction = jest.fn()
    it('should render DialogCloseButton in Desktop view & "onClose" prop is defined', () => {
      useBreakpoints.mockReturnValue({ isMobile: false })
      const { queryByTestId } = render(<StepperDialog onClose={closeAction} />)

      expect(queryByTestId('DialogCloseButton')).toBeTruthy()
    })

    it('should not render DialogCloseButton in Desktop view & "onClose" prop is undefined', () => {
      useBreakpoints.mockReturnValue({ isMobile: false })
      const { queryByTestId } = render(<StepperDialog />)

      expect(queryByTestId('DialogCloseButton')).not.toBeTruthy()
    })

    it('should not render DialogCloseButton in Mobile view even if "onClose" prop is defined', () => {
      useBreakpoints.mockReturnValue({ isMobile: true })
      const { queryByTestId } = render(<StepperDialog onClose={closeAction} />)

      expect(queryByTestId('DialogCloseButton')).not.toBeTruthy()
    })

    it('should called closeAction function', () => {
      useBreakpoints.mockReturnValue({ isMobile: false })
      const { queryByTestId } = render(<StepperDialog onClose={closeAction} />)

      const dialogCloseButton = queryByTestId('DialogCloseButton')

      fireEvent.click(dialogCloseButton)

      expect(closeAction).toBeCalledTimes(1)
    })
  })

  describe('DialogBackButton', () => {
    const backAction = jest.fn()
    it('should render DialogBackButton if "onBack" prop is defined', () => {
      const { queryByTestId } = render(<StepperDialog onBack={backAction} />)

      expect(queryByTestId('DialogBackButton')).toBeTruthy()
    })

    it('should not render DialogBackButton if "onBack" prop is undefined', () => {
      const { queryByTestId } = render(<StepperDialog />)

      expect(queryByTestId('DialogBackButton')).not.toBeTruthy()
    })

    it('should called backAction function', () => {
      const { queryByTestId } = render(<StepperDialog onBack={backAction} />)

      const dialogBackButton = queryByTestId('DialogBackButton')

      fireEvent.click(dialogBackButton)

      expect(backAction).toBeCalledTimes(1)
    })
  })
})
