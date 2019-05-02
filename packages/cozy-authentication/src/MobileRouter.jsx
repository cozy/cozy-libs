import React, { Component } from 'react'
import { Router } from 'react-router'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'

import Authentication from './Authentication'
import Revoked from './Revoked'
import * as onboarding from './utils/onboarding'

import deeplink from './utils/deeplink'
import credentials from './utils/credentials'

// Even if the component is not yet mounted, we save
// the deeplink
window.handleOpenURL = deeplink.save

const clientUpdateEvents = ['login', 'logout', 'revoked', 'unrevoked']

export const LoggingInViaOnboarding = () => null

export class MobileRouter extends Component {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.handleDeepLink = this.handleDeepLink.bind(this)
    this.handleUniversalLink = this.handleUniversalLink.bind(
      this
    )
    this.handleLogBackIn = this.handleLogBackIn.bind(this)
    this.afterAuthentication = this.afterAuthentication.bind(this)

    this.afterLogout = this.afterLogout.bind(this)
    this.handleBeforeLogout = this.handleBeforeLogout.bind(this)
    this.handleRequestLogout = this.handleRequestLogout.bind(this)

    this.state = { isLoggingInViaOnboarding: false }
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
    if (saved && saved.oauthOptions) {
      client.stackClient.setOAuthOptions(saved.oauthOptions)
      client.login({ uri: saved.uri, token: saved.token })
    }
  }

  startListeningToClient() {
    const { client } = this.props
    for (let ev of clientUpdateEvents) {
      client.on(ev, this.update)
    }
    client.on('login', this.afterAuthentication)
    client.on('beforeLogout', this.handleBeforeLogout)
    client.on('logout', this.afterLogout)
  }

  stopListeningToClient() {
    const { client } = this.props
    for (let ev of clientUpdateEvents) {
      client.removeListener(ev, this.update)
    }
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

  handleDeepLink(url) {
    const { protocol, appSlug, universalLinkDomain } = this.props
    url = url || deeplink.get()
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
      history,
      appIcon,
      appTitle,
      appRoutes,
      onException,
      client,
      children,

      // TODO LogoutComponent should come from props.components and have
      // a default
      LogoutComponent
    } = this.props

    const { Authentication, Revoked } = this.props.components
    const { isLoggingInViaOnboarding, isLoggingOut } = this.state

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
      return <Router history={history}>{appRoutes || children}</Router>
    }
  }

  async handleLogBackIn() {
    const { client } = this.props
    await client.stackClient.unregister().catch(() => {})
    await onboarding.registerAndLogin(client, client.stackClient.uri)
  }

  async afterAuthentication() {
    this.props.history.replace(this.props.loginPath)
    await credentials.saveFromClient(this.props.client)
    if (this.props.onAuthenticated) {
      this.props.onAuthenticated()
    }
  }

  handleBeforeLogout() {
    this.setState({ isLoggingOut: true })
  }

  async afterLogout() {
    this.setState({ isLoggingOut: false })
    this.props.history.replace(this.props.logoutPath)
    await credentials.clear()
    if (this.props.onLogout) {
      this.props.onLogout()
    }
  }

  async handleRequestLogout() {
    const { client } = this.props
    await client.logout()
  }
}

MobileRouter.defaultProps = {
  onException: e => {
    console.error('Exception', e) //eslint-disable-line no-console
  },

  loginPath: '/',
  logoutPath: '/',

  components: {
    Authentication,
    Revoked
  }
}

MobileRouter.propTypes = {
  history: PropTypes.object.isRequired,

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

  /** After login, where do we go */
  loginPath: PropTypes.string,
  /** After logout, where do we go */
  logoutPath: PropTypes.string,

  /** LogoutComponent is displayed while the client is logging out */
  LogoutComponent: PropTypes.elementType
}

export const DumbMobileRouter = MobileRouter

export default withClient(MobileRouter)
