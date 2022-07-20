import React from 'react'
import { render } from '@testing-library/react'
import { Switch, Redirect } from 'react-router-dom'
import { createHashHistory } from 'history'

import { useQuery, hasQueryBeenLoaded } from 'cozy-client'

import AppLike from '../../test/components/AppLike'
import OnboardedGuardedRoute from './OnboardedGuardedRoute'
import { OnboardingProvider } from './Contexts/OnboardingProvider'

jest.mock('cozy-client/dist/hooks/useQuery')
jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  hasQueryBeenLoaded: jest.fn()
}))

const ComponentOnboarded = () => <div>ONBOARDED</div>
const ComponentOnboarding = () => <div>ONBOARDING</div>
const MockOnboarding = () => <div data-testid="MockOnboarding" />

const setup = ({ result, isLoaded = true, history, Onboarding }) => {
  hasQueryBeenLoaded.mockReturnValue(isLoaded)
  useQuery.mockReturnValue({ data: result })

  return render(
    <AppLike history={history}>
      <OnboardingProvider OnboardingComponent={Onboarding}>
        <Switch>
          <OnboardedGuardedRoute
            exact
            path="/paper"
            component={ComponentOnboarded}
          />
          <OnboardedGuardedRoute
            exact
            path="/paper/onboarding"
            component={ComponentOnboarding}
          />

          <Redirect from="*" to="/paper" />
        </Switch>
      </OnboardingProvider>
    </AppLike>
  )
}

describe('OnboardedGuardedRoute', () => {
  it('should display Spinner when query is not loaded', () => {
    const { getByRole } = setup({ result: undefined, isLoaded: false })

    expect(getByRole('progressbar')).toBeDefined()
  })

  it('should display route when onboarded = true', () => {
    const { getByText } = setup({ result: [{ onboarded: true }] })

    expect(getByText('ONBOARDED')).toBeDefined()
  })

  it('should redirect to /paper/onboarding route when onboarded = false && Onboarding component exists', () => {
    const { getByText } = setup({
      result: [{ onboarded: false }],
      Onboarding: MockOnboarding
    })

    expect(getByText('ONBOARDING')).toBeDefined()
  })

  it('should redirect to /paper/onboarding route when onboarded is undefined && Onboarding component exists', () => {
    const { getByText } = setup({
      result: undefined,
      Onboarding: MockOnboarding
    })

    expect(getByText('ONBOARDING')).toBeDefined()
  })

  it('should redirect to /paper/onboarding route when onboarded is empty array && Onboarding component exists', () => {
    const { getByText } = setup({ result: [], Onboarding: MockOnboarding })

    expect(getByText('ONBOARDING')).toBeDefined()
  })

  it('should display route when onboarded is false && Onboarding component exists', () => {
    const history = createHashHistory()
    history.push('/paper/onboarding')

    const { getByText } = setup({
      result: [{ onboarded: false, history }],
      Onboarding: MockOnboarding
    })

    expect(getByText('ONBOARDING')).toBeDefined()
  })

  it('should redirect to /paper route when onboarded is true', () => {
    const history = createHashHistory()
    history.push('/paper/onboarding')

    const { getByText } = setup({ result: [{ onboarded: true, history }] })

    expect(getByText('ONBOARDED')).toBeDefined()
  })
})
