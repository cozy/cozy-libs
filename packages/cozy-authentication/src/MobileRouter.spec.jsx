import React from 'react'
import { shallow, mount } from 'enzyme'
import PropTypes from 'prop-types'

import CozyClient, { CozyProvider } from 'cozy-client'

import Authentication from './Authentication'
import MobileRouter, { DumbMobileRouter, LoggingInViaOnboarding } from './MobileRouter'
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

  render () {
    return this.props.children
  }
}

const AppRoutes = () => <div />

describe('MobileRouter', () => {
  let appRoutes,
    isAuthenticated,
    isRevoked,
    onAuthenticated,
    onLogout,
    history,
    appIcon,
    appTitle,
    app,
    client,
    instance,
    props

  beforeEach(() => {  
    appRoutes = <AppRoutes />
    onAuthenticated = jest.fn()
    onLogout = jest.fn()
    history = { replace: jest.fn() }
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
          <MobileRouter {...props} loginPath='/afterLogin' logoutPath='/afterLogout' />
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
    const instance = app.find(DumbMobileRouter).instance()
    client.emit('login')
    expect(history.replace).toHaveBeenCalledWith('/afterLogin')
  })

  it('should go to logoutPath after logout', () => {
    setup()
    const instance = app.find(DumbMobileRouter).instance()
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

  it('should render a special view when logging in via onboarding has started', () => {
    app = shallow(<DumbMobileRouter {...props} client={client} />)
    app.setState({ isLoggingInViaOnboarding: true })
    expect(app.find(LoggingInViaOnboarding).length).toBe(1)
  })

  it('should render the appRoutes when client is logged, not revoked, and not onboarding', () => {
    client.isLogged = true
    setup()
    expect(app.find(AppRoutes).length).toBe(1)
  })

  describe('Auto Onboarding', () => {
    it('should call client.logout if doOnboarding fails', async () => {
      setup()
      const mobileRouter = app.find(DumbMobileRouter).instance()
      jest.spyOn(onboarding, 'doOnboardingLogin').mockRejectedValue({})
      jest.spyOn(client, 'logout')
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      mobileRouter.handleAuth()
      expect(client.logout).toHaveBeenCalled()
    })
  })
})
