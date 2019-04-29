import React from 'react'
import { mount } from 'enzyme'
import PropTypes from 'prop-types'

import CozyClient, { CozyProvider } from 'cozy-client'

import Authentication from './Authentication'
import MobileRouter, {
  DumbMobileRouter,
  LoggingInViaOnboarding
} from './MobileRouter'
import Revoked from './Revoked'
import * as onboarding from './utils/onboarding'

jest.mock('react-router', () => ({
  Router: props => props.children
}))

class I18n extends React.Component {
  static childContextTypes = {
    t: PropTypes.func
  }

  getChildContext() {
    return { t: this.props.t }
  }

  render() {
    return this.props.children
  }
}

const AppRoutes = () => <div />

describe('MobileRouter', () => {
  let appRoutes,
    onAuthenticated,
    onLogout,
    history,
    appIcon,
    appTitle,
    app,
    client,
    currentLocation,
    props

  beforeEach(() => {
    appRoutes = <AppRoutes />
    onAuthenticated = jest.fn()
    onLogout = jest.fn()
    history = {
      replace: jest.fn(),
      getCurrentLocation: jest.fn(() => currentLocation)
    }
    appIcon = 'icon.png'
    appTitle = 'Test App'
    app = null
    client = new CozyClient({})
    props = { appRoutes, onAuthenticated, onLogout, history, appIcon, appTitle }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    app = mount(
      <CozyProvider client={client}>
        <I18n t={x => x}>
          <MobileRouter
            {...props}
            loginPath="/afterLogin"
            logoutPath="/afterLogout"
          />
        </I18n>
      </CozyProvider>
    )
  }

  it('should listen to the client', () => {
    setup()
    const instance = app.find(DumbMobileRouter).instance()
    jest.spyOn(instance, 'forceUpdate')
    client.emit('login')
    expect(instance.forceUpdate).toHaveBeenCalled()
  })

  it('should go to loginPath after login', () => {
    setup()
    client.emit('login')
    expect(history.replace).toHaveBeenCalledWith('/afterLogin')
  })

  it('should go to logoutPath after logout', () => {
    setup()
    client.emit('logout')
    expect(history.replace).toHaveBeenCalledWith('/afterLogout')
  })

  it('should render the auth screen when client is not logged', () => {
    client.isLogged = false
    setup()
    expect(app.find(Authentication).length).toBe(1)
  })

  it('should render the revoked view when logged and revoked', () => {
    client.isLogged = true
    client.isRevoked = true
    setup()
    expect(app.find(Revoked).length).toBe(1)
  })

  it('should render the appRoutes when client is logged, not revoked, and not onboarding', () => {
    client.isLogged = true
    setup()
    expect(app.find(AppRoutes).length).toBe(1)
  })

  describe('Auto Onboarding', () => {
    it('should render a special view when logging in via onboarding has started', async () => {
      setup()
      currentLocation = {
        query: {
          access_code: 'accessCode',
          state: 'state-123',
          cozy_url: 'pbrowne.mycozy.cloud'
        }
      }
      const mobileRouter = app.find(DumbMobileRouter).instance()
      jest
        .spyOn(onboarding, 'doOnboardingLogin')
        .mockImplementation(async () => {
          // Necessary to call update() since setState is called asynchronously
          // https://github.com/airbnb/enzyme/issues/450
          app.update()
          expect(app.find(LoggingInViaOnboarding).length).toBe(1)
        })
      await mobileRouter.handleAuth()
      app.update()
      expect(onboarding.doOnboardingLogin).toHaveBeenCalled()
      expect(app.find(LoggingInViaOnboarding).length).toBe(0)
    })

    it('should call client.logout if doOnboarding fails', async () => {
      setup()
      const mobileRouter = app.find(DumbMobileRouter).instance()
      jest.spyOn(onboarding, 'doOnboardingLogin').mockRejectedValue({})
      jest.spyOn(client, 'logout')
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      jest.spyOn(console, 'error').mockImplementation(() => {})
      await mobileRouter.handleAuth()
      expect(client.logout).toHaveBeenCalled()
    })
  })
})
