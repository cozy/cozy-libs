import { render } from '@testing-library/react'
import React from 'react'

import flag from 'cozy-flags'

import { usePapersDefinitions } from './Hooks/usePapersDefinitions'
import { MesPapiersLibLayout } from './MesPapiersLibLayout'
import AppLike from '../../test/components/AppLike'

/* eslint-disable react/display-name */
jest.mock('cozy-ui/transpiled/react/deprecated/Alerter', () => () => (
  <div data-testid="Alerter" />
))
jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  RealTimeQueries: () => <div data-testid="RealTimeQueries" />
}))
jest.mock('cozy-flags')
jest.mock('cozy-flags/dist/FlagSwitcher', () => () => (
  <div data-testid="FlagSwitcher" />
))
jest.mock('./Hooks/usePapersDefinitions')
/* eslint-enable react/display-name */

const setup = ({
  isFlag = false,
  customPapersDefinitions = { isLoaded: true, name: '' },
  components
} = {}) => {
  flag.mockReturnValue(isFlag)
  usePapersDefinitions.mockReturnValue({
    papersDefinitions: [],
    customPapersDefinitions
  })

  return render(
    <AppLike>
      <MesPapiersLibLayout {...(components && { components: components })} />
    </AppLike>
  )
}

describe('MesPapiersLibLayout', () => {
  it('should contain FlagSwitcher when flag "switcher" is activate', () => {
    const { queryByTestId } = setup({ isFlag: true })

    expect(queryByTestId('FlagSwitcher')).toBeTruthy()
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

    expect(queryAllByTestId('RealTimeQueries')).toHaveLength(4)
    expect(queryByTestId('Alerter')).toBeTruthy()
  })
})
