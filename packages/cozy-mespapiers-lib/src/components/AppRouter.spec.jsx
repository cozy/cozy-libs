import React from 'react'
import { render } from '@testing-library/react'

import { AppRouter } from './AppRouter'
import AppLike from '../../test/components/AppLike'

/* eslint-disable react/display-name */
jest.mock('./OnboardedGuardedRoute', () => ({ component, render }) => {
  return (
    <div data-testid="OnboardedGuardedRoute">
      {render
        ? render({
            location: { search: '' },
            history: jest.fn(() => ({ go: jest.fn() }))
          })
        : component()}
    </div>
  )
})
jest.mock('./StepperDialog/CreatePaperModal', () => () => (
  <div data-testid="CreatePaperModal" />
))
jest.mock('./Home/Home', () => () => <div data-testid="Home" />)
jest.mock('./Onboarding/Onboarding', () => () => (
  <div data-testid="Onboarding" />
))
jest.mock('./Papers/PapersListWrapper', () => () => (
  <div data-testid="PapersListWrapper" />
))
jest.mock('./Viewer/FileViewerWithQuery', () => () => (
  <div data-testid="FileViewerWithQuery" />
))
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ goBack: jest.fn() })),
  HashRouter: ({ children }) => <div data-testid="HashRouter">{children}</div>,
  Redirect: ({ children }) => <div data-testid="Redirect">{children}</div>,
  Switch: ({ children }) => <div data-testid="Switch">{children}</div>
}))
/* eslint-enable react/display-name */

describe('AppRouter', () => {
  it('should render home, onboarding, papersListWrapper, fileViewerWithQuery components', () => {
    const { queryByTestId } = render(
      <AppLike>
        <AppRouter />
      </AppLike>
    )

    expect(queryByTestId('Home')).toBeTruthy()
    expect(queryByTestId('Onboarding')).toBeTruthy()
    expect(queryByTestId('PapersListWrapper')).toBeTruthy()
    expect(queryByTestId('FileViewerWithQuery')).toBeTruthy()
  })
})
