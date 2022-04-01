import React from 'react'
import { render } from '@testing-library/react'
import { Switch, Redirect } from 'react-router-dom'
import { createHashHistory } from 'history'

import { useQuery, hasQueryBeenLoaded } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import OnboardedGuardedRoute from 'src/components/OnboardedGuardedRoute'

jest.mock('cozy-client/dist/hooks/useQuery')
jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  hasQueryBeenLoaded: jest.fn()
}))

const ComponentOnboarded = () => <div>ONBOARDED</div>
const ComponentOnboarding = () => <div>ONBOARDING</div>

const setup = ({ result, isLoaded = true, history }) => {
  hasQueryBeenLoaded.mockReturnValue(isLoaded)
  useQuery.mockReturnValue({ data: result })

  return render(
    <AppLike history={history}>
      <Switch>
        <OnboardedGuardedRoute exact path="/" component={ComponentOnboarded} />
        <OnboardedGuardedRoute
          exact
          path="/onboarding"
          component={ComponentOnboarding}
        />

        <Redirect from="*" to="/" />
      </Switch>
    </AppLike>
  )
}

describe('AppRouter', () => {
  describe('OnboardedGuardedRoute', () => {
    it('should display Spinner when query is not loaded', () => {
      const { getByRole } = setup({ result: undefined, isLoaded: false })

      expect(getByRole('progressbar')).toBeDefined()
    })

    it('should display route when onboarded = true', () => {
      const { getByText } = setup({ result: [{ onboarded: true }] })

      expect(getByText('ONBOARDED')).toBeDefined()
    })

    it('should redirect to /onboarding route when onboarded = false', () => {
      const { getByText } = setup({ result: [{ onboarded: false }] })

      expect(getByText('ONBOARDING')).toBeDefined()
    })

    it('should redirect to /onboarding route when onboarded is undefined', () => {
      const { getByText } = setup({ result: undefined })

      expect(getByText('ONBOARDING')).toBeDefined()
    })

    it('should redirect to /onboarding route when onboarded is empty array', () => {
      const { getByText } = setup({ result: [] })

      expect(getByText('ONBOARDING')).toBeDefined()
    })

    it('should display route route when onboarded is false', () => {
      const history = createHashHistory()
      history.push('/onboarding')

      const { getByText } = setup({ result: [{ onboarded: false, history }] })

      expect(getByText('ONBOARDING')).toBeDefined()
    })

    it('should redirect to / route when onboarded is true', () => {
      const history = createHashHistory()
      history.push('/onboarding')

      const { getByText } = setup({ result: [{ onboarded: true, history }] })

      expect(getByText('ONBOARDED')).toBeDefined()
    })
  })
})
