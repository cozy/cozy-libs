import React from 'react'
import { render } from '@testing-library/react'

import flag from 'cozy-flags'

import { useStepperDialog } from 'src/components/Hooks/useStepperDialog'
import { usePapersDefinitions } from 'src/components/Hooks/usePapersDefinitions'
import MesPapiersLib from 'src/components/MesPapiersLib'
import AppLike from 'test/components/AppLike'

/* eslint-disable react/display-name */
jest.mock('cozy-ui/transpiled/react/Alerter', () => () => (
  <div data-testid="Alerter" />
))
jest.mock('src/components/Contexts/ModalProvider', () => ({
  ...jest.requireActual('src/components/Contexts/ModalProvider'),
  ModalStack: () => <div data-testid="ModalStack" />
}))
jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  RealTimeQueries: () => <div data-testid="RealTimeQueries" />
}))
jest.mock('src/components/AppRouter', () => ({
  AppRouter: () => <div data-testid="AppRouter" />
}))
jest.mock('cozy-flags')
jest.mock('cozy-flags/dist/FlagSwitcher', () => () => (
  <div data-testid="FlagSwitcher" />
))
jest.mock('src/components/Hooks/useStepperDialog')
jest.mock('src/components/Hooks/usePapersDefinitions')
/* eslint-enable react/display-name */

const setup = ({
  isFlag = false,
  papersDefinitions = [],
  customPapersDefinitions = { isLoaded: true, name: '' },
  isStepperDialogOpen = false
} = {}) => {
  flag.mockReturnValue(isFlag)
  useStepperDialog.mockReturnValue({ isStepperDialogOpen })
  usePapersDefinitions.mockReturnValue({
    papersDefinitions,
    customPapersDefinitions
  })

  return render(
    <AppLike>
      <MesPapiersLib />
    </AppLike>
  )
}

describe('MesPapiersLib', () => {
  it('should contain FlagSwitcher when flag "switcher" is activate', () => {
    const { queryByTestId } = setup({ isFlag: true })

    expect(queryByTestId('FlagSwitcher')).toBeTruthy()
  })

  it('should return AppRouter component', () => {
    const { queryByTestId } = setup({ papersDefinitions: ['1', '2'] })

    expect(queryByTestId('AppRouter')).toBeTruthy()
  })

  it('should contain "custom name" text if custom papersDefinitions file is used', () => {
    const { queryByText } = setup({
      customPapersDefinitions: {
        isLoaded: true,
        name: 'custom name'
      }
    })

    expect(
      queryByText('File "custom name" loaded from your Drive')
    ).toBeTruthy()
  })

  it('should contain progressbar when no papers', () => {
    const { getByRole } = setup()
    expect(getByRole('progressbar')).toBeTruthy()
  })

  it('should contain RealTimeQueries(2), Alerter & ModalStack components', () => {
    const { queryByTestId, queryAllByTestId } = setup()

    expect(queryAllByTestId('RealTimeQueries')).toHaveLength(2)
    expect(queryByTestId('Alerter')).toBeTruthy()
    expect(queryByTestId('ModalStack')).toBeTruthy()
  })
})
