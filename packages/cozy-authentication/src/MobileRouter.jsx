import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Router } from 'react-router'
import { HashRouter, useLocation, useNavigate } from 'react-router-dom'

import { withClient } from 'cozy-client'
import Modal from 'cozy-ui/transpiled/react/Modal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import Authentication from './Authentication'
import Revoked from './Revoked'
import credentials from './utils/credentials'
import deeplink from './utils/deeplink'
import * as onboarding from './utils/onboarding'

// Even if the component is not yet mounted, we save
// the deeplink
window.handleOpenURL = deeplink.save

const clientUpdateEvents = ['login', 'logout', 'revoked', 'unrevoked']

export const LoggingInViaOnboarding = () => null

const centeredFullscreen = {
  justifyContent: 'center',
  height: '100%',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column'
}

export const LoginInComponent = () => {
  return (
    <Modal into="body" mobileFullscreen closable={false}>
      <div style={centeredFullscreen}>
        <Spinner size="xxlarge" />
      </div>
    </Modal>
  )
}

export class MobileRouter extends Component {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.handleDeepLink = this.handleDeepLink.bind(this)
    this.handleUniversalLink = this.handleUniversalLink.bind(this)
    this.handleLogBackIn = this.handleLogBackIn.bind(this)
    this.afterAuthentication = this.afterAuthentication.bind(this)

    this.afterLogout = this.afterLogout.bind(this)
    this.handleBeforeLogin = this.handleBeforeLogin.bind(this)
    this.handleBeforeLogout = this.handleBeforeLogout.bind(this)
    this.handleRequestLogout = this.handleRequestLogout.bind(this)

    this.state = {
      isLoggingInViaOnboarding: false,
      triedToReconnect: props.initialTriedToReconnect || false
    }
  }

  componentDidMount() {
    this.startListeningToClient()
    this.startHandlingDeeplinks()
    this.startListeningToUniversalLinks()
    this.tryToReconnect()
  }

  async tryToReconnect() {
    const client = this.props.client
    const saved = await credentials.get()
    try {
      if (saved && saved.oauthOptions) {
        client.stackClient.setOAuthOptions(saved.oauthOptions)
        await client.login({
          uri: saved.uri,
          token: saved.token
        })
      }
    } finally {
      this.setState({ triedToReconnect: true })
    }
  }

  startListeningToClient() {
    const { client } = this.props
    for (let ev of clientUpdateEvents) {
      client.on(ev, this.update)
    }
    client.on('beforeLogin', this.handleBeforeLogin)
    client.on('login', this.afterAuthentication)
    client.on('beforeLogout', this.handleBeforeLogout)
    client.on('logout', this.afterLogout)
  }

  stopListeningToClient() {
    const { client } = this.props
    for (let ev of clientUpdateEvents) {
      client.removeListener(ev, this.update)
    }
    client.removeListener('beforeLogin', this.handleBeforeLogin)
    client.removeListener('login', this.afterAuthentication)
    client.removeListener('beforeLogout', this.handleBeforeLogout)
    client.removeListener('logout', this.afterLogout)
  }

  startListeningToUniversalLinks() {
    if (window.universalLinks) {
      window.universalLinks.subscribe(
        'openUniversalLink',
        this.handleUniversalLink
      )
    }
  }

  componentWillUnmount() {
    this.stopHandlingDeeplinks()
    this.stopListeningToClient()
    this.stopListeningToUniversalLinks()
    this.unmounted = true
  }

  update() {
    this.forceUpdate()
  }

  handleUniversalLink(eventData) {
    /*
    @TODO: openUniversalLink seems to be called only on iOS.
    android uses handleOpenURL by default ?!
   */
    this.handleDeepLink(eventData.url)
    if (window.handleOpenURL !== this.handleDeepLink) {
      // This means that someone else is handling open url, must
      // be cozy-client that replaced the function during the
      // normal register. We have to call the function in its place
      // See cozy-client/src/authentication/mobile
      //
      // The handler of open url has the responsibility to replace
      // window.handleOpenURL back with our handler (which cozy-client
      // rightfully does).
      window.handleOpenURL(eventData.url)
    }
  }

  startHandlingDeeplinks() {
    // While this component is mounted, it handles deep links
    this.originalHandleOpenURL = window.handleOpenURL
    window.handleOpenURL = this.handleDeepLink
    // If a deep link was opened when this component was not yet mounted
    const link = deeplink.get()
    if (link) {
      this.handleDeepLink(link)
    }
  }

  stopHandlingDeeplinks() {
    window.handleOpenURL = this.originalHandleOpenURL
  }

  stopListeningToUniversalLinks() {
    if (window.universalLinks) {
      window.universalLinks.unsubscribe('openUniversalLink')
    }
  }

  handleDeepLink(urlArg) {
    const { protocol, appSlug, universalLinkDomain } = this.props
    const url = urlArg || deeplink.get()
    deeplink.clear()
    if (!url) {
      return
    }
    const appInfos = {
      protocol,
      appSlug,
      universalLinkDomain
    }
    const path = deeplink.generateRoute(url, appInfos)
    this.props.history.replace('/' + path)
    if (path.startsWith('auth')) {
      this.handleAuth()
    }
  }

  async handleAuth() {
    const { client, history } = this.props
    try {
      const currentLocation = history.getCurrentLocation()
      const { access_code, state, cozy_url, code } = currentLocation.query
      if (!code || !cozy_url) {
        // Here it means that were are not in an onboarding login, we are
        // in a normal login, the register() called in Authentication::selectServer
        // should have completed
        return
      }

      // on iOS, hide() the ViewController since it is still active
      // when the application comes from background
      if (window.SafariViewController) window.SafariViewController.hide()
      this.setState({ isLoggingInViaOnboarding: true })
      await onboarding.doOnboardingLogin(client, cozy_url, state, access_code)
      this.afterAuthentication()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while trying to automatically login', error)
      await client.logout()
    } finally {
      if (!this.unmounted) {
        this.setState({ isLoggingInViaOnboarding: false })
      }
    }
  }

  render() {
    const {
      appIcon,
      appTitle,
      appRoutes,
      onException,
      client,
      LoginInComponent,
      children,
      // TODO LogoutComponent should come from props.components and have
      // a default
      LogoutComponent
    } = this.props

    const { Authentication, Revoked } = this.props.components
    const {
      isLoggingInViaOnboarding,
      isLoggingIn,
      isLoggingOut,
      triedToReconnect
    } = this.state

    if (!triedToReconnect) {
      return null
    }

    if (isLoggingIn) {
      return <LoginInComponent />
    }

    if (LogoutComponent && isLoggingOut) {
      return <LogoutComponent />
    }

    if (isLoggingInViaOnboarding) {
      return <LoggingInViaOnboarding />
    }

    if (!client.isLogged) {
      return (
        <Authentication
          onComplete={this.afterAuthentication}
          onException={onException}
          appIcon={appIcon}
          appTitle={appTitle}
        />
      )
    } else if (client.isRevoked) {
      return (
        <Revoked
          onLogBackIn={this.handleLogBackIn}
          onLogout={this.handleRequestLogout}
        />
      )
    } else {
      return <>{appRoutes || children}</>
    }
  }

  async handleLogBackIn() {
    const { client } = this.props
    await client.stackClient.unregister().catch(() => {})
    await onboarding.registerAndLogin(client, client.stackClient.uri)
  }

  handleBeforeLogin() {
    this.setState({ isLoggingIn: true })
  }

  async afterAuthentication() {
    if (this.props.onAuthenticated) {
      await this.props.onAuthenticated({ history: this.props.history })
    }

    await credentials.saveFromClient(this.props.client)
    // We need to set the state after all the previous actions
    // since we can have async task in `onAuthenticated`. Setting
    // isLoggingIn to true before result in displaying `appRoutes`
    // too soon in this case
    this.setState({ isLoggingIn: false })
  }

  handleBeforeLogout() {
    this.setState({ isLoggingOut: true })
  }

  async afterLogout() {
    this.setState({ isLoggingOut: false })
    this.props.history.replace(this.props.logoutPath)
    await credentials.clear()
    if (this.props.onLogout) {
      this.props.onLogout({ history: this.props.history })
    }
  }

  async handleRequestLogout() {
    const { client } = this.props
    await client.logout()
  }
}

MobileRouter.defaultProps = {
  onException: e => {
    console.error('Exception', e) // eslint-disable-line no-console
  },

  logoutPath: '/',

  components: {
    Authentication,
    Revoked
  },

  LoginInComponent
}

MobileRouter.propTypes = {
  history: PropTypes.object,

  appRoutes: PropTypes.node,
  children: PropTypes.node,
  appTitle: PropTypes.string.isRequired,
  appIcon: PropTypes.string.isRequired,
  appSlug: PropTypes.string.isRequired,

  universalLinkDomain: PropTypes.string.isRequired,

  onAuthenticated: PropTypes.func,
  onLogout: PropTypes.func,
  onException: PropTypes.func.isRequired,

  /** CozyClient instance, should be provided via <CozyProvider /> */
  client: PropTypes.object.isRequired,

  /** After logout, where do we go */
  logoutPath: PropTypes.string,

  /** LoginInComponent is displayed while the client is logging out */
  LoginInComponent: PropTypes.elementType,

  /** LogoutComponent is displayed while the client is logging out */
  LogoutComponent: PropTypes.elementType,

  /** Used to set internal state property `triedToReconnect` on instantation.
   *  Is used by tests.
   */
  initialTriedToReconnect: PropTypes.bool
}

const MobileRouterV3 = ({ children, history, ...props }) => {
  return (
    <MobileRouter history={history} {...props}>
      {children}
    </MobileRouter>
  )
}

const MobileRouterDomV6 = ({ children, ...props }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const history = {
    replace: path => {
      navigate(path, { replace: true })
    },
    getCurrentLocation: () => {
      return location
    }
  }
  return (
    <MobileRouter history={history} {...props}>
      {children}
    </MobileRouter>
  )
}

const MobileRouterWrapper = ({ children, history, ...props }) => {
  if (history) {
    // react-router@3
    return (
      <Router history={history}>
        <MobileRouterV3 history={history} {...props}>
          {children}
        </MobileRouterV3>
      </Router>
    )
  } else {
    // react-router-dom@6
    return (
      <HashRouter>
        <MobileRouterDomV6 {...props}>{children}</MobileRouterDomV6>
      </HashRouter>
    )
  }
}

export const DumbMobileRouter = MobileRouter

export default withClient(MobileRouterWrapper)
