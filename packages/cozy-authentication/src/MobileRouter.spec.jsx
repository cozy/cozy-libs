import { mount } from 'enzyme'
import React from 'react'

import CozyClient, { CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/transpiled/react/I18n'

import Authentication from './Authentication'
import MobileRouter, {
  DumbMobileRouter,
  LoggingInViaOnboarding,
  LoginInComponent
} from './MobileRouter'
import Revoked from './Revoked'
import * as onboarding from './utils/onboarding'

jest.mock('react-router', () => ({
  Router: props => props.children
}))

const AppRoutes = () => <div />
const LoggingOut = () => <div>Logging out...</div>

describe('MobileRouter', () => {
  let appRoutes,
    onAuthenticated,
    onLogout,
    history,
    appIcon,
    appTitle,
    appSlug,
    app,
    client,
    currentLocation,
    props,
    LogoutComponent,
    universalLinkDomain

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
    appSlug = 'test'
    universalLinkDomain = 'https://ul.mycozy.cloud'
    app = null
    client = new CozyClient({})
    props = {
      appRoutes,
      onAuthenticated,
      onLogout,
      history,
      appIcon,
      appTitle,
      appSlug,
      universalLinkDomain
    }
    LogoutComponent = null
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    app = mount(
      <CozyProvider client={client}>
        <I18n t={x => x} lang="en" dictRequire={() => ({})}>
          <MobileRouter
            {...props}
            logoutPath="/afterLogout"
            initialTriedToReconnect={true}
            LogoutComponent={LogoutComponent}
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

  it('should call onAuthenticated prop if defined', () => {
    setup()
    client.emit('login')
    expect(onAuthenticated).toHaveBeenCalled()
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

  describe('universal link', () => {
    it('should call handleDeepLink with the url from the event', () => {
      setup()
      const instance = app.find(DumbMobileRouter).instance()
      jest.spyOn(instance, 'handleDeepLink')
      instance.handleUniversalLink({ url: 'http://fake.url.com' })
      expect(instance.handleDeepLink).toHaveBeenCalledWith(
        'http://fake.url.com'
      )
    })

    it('should not call window.handleOpenURL if it has not been touched by something else', () => {
      // Here window.handleOpenURL will be replaced by the handler from MobileRouter
      // We have to use handler since window.handleOpenURL is replaced by something that
      // is not a spy by MobileRouter
      const handler = jest.fn()
      window.handleOpenURL = handler
      setup()
      const instance = app.find(DumbMobileRouter).instance()
      instance.handleUniversalLink({ url: 'http://fake.url.com' })
      expect(handler).not.toHaveBeenCalled()
    })

    it('should call window.handleOpenURL if it has been touched by something else', () => {
      setup()
      const instance = app.find(DumbMobileRouter).instance()
      jest.spyOn(instance, 'handleDeepLink')
      // Here window.handleOpenURL is replaced during the life of MobileRouter; it must be
      // important. It should be called.
      window.handleOpenURL = jest.fn()
      instance.handleUniversalLink({ url: 'http://fake.url.com' })
      expect(window.handleOpenURL).toHaveBeenCalledWith('http://fake.url.com')
    })
  })

  describe('Logging in', () => {
    it('should show LogInComponent during login', async () => {
      LogoutComponent = LoggingOut
      setup()
      client.emit('beforeLogin')
      app.update()
      expect(app.find(LoginInComponent).length).toBe(1)
      // We don't emit('login') since we need to wait the end of
      // `afterAuthentication` now to check if the login component is
      // here or not. So we call afterAuth manually
      const mobileRouter = app.find(DumbMobileRouter).instance()

      await mobileRouter.afterAuthentication()
      app.update()
      expect(app.find(LoginInComponent).length).toBe(0)
    })
  })

  describe('Logging out', () => {
    it('should not error if LogoutComponent not available', () => {
      setup()
      client.emit('beforeLogout')
      app.update()
      client.emit('logout')
      app.update()
      expect(true).toBe(true)
    })

    it('should show LogoutComponent during logout', () => {
      LogoutComponent = LoggingOut
      setup()
      client.emit('beforeLogout')
      app.update()
      expect(app.find(LoggingOut).length).toBe(1)
      client.emit('logout')
      app.update()
      expect(app.find(LoggingOut).length).toBe(0)
    })
  })

  describe('Auto Onboarding', () => {
    let query

    beforeEach(() => {
      query = {
        access_code: 'accessCode',
        state: 'state-123',
        cozy_url: 'pbrowne.mycozy.cloud',
        code: 'code-that-is-only-in-onboarding'
      }
    })

    it('should render a special view when logging in via onboarding has started', async () => {
      setup()
      currentLocation = {
        query
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

    for (const requiredOnboardingArg of ['cozy_url', 'code']) {
      it(`should not do an onboarding login if ${requiredOnboardingArg} is not in the URL`, async () => {
        delete query[requiredOnboardingArg]
        setup()
        currentLocation = {
          query
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
        expect(onboarding.doOnboardingLogin).not.toHaveBeenCalled()
      })
    }
  })
})
