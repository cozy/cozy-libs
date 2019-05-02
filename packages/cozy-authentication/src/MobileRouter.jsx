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

    this.handleLogBackIn = this.handleLogBackIn.bind(this)
    this.afterAuthentication = this.afterAuthentication.bind(this)
    this.afterLogout = this.afterLogout.bind(this)
    this.handleRequestLogout = this.handleRequestLogout.bind(this)

    this.state = { isLoggingInViaOnboarding: false }
  }

  componentDidMount() {
    this.startListeningToClient()
    this.startHandlingDeeplinks()
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
    client.on('logout', this.afterLogout)
  }

  stopListeningToClient() {
    const { client } = this.props
    for (let ev of clientUpdateEvents) {
      client.removeListener(ev, this.update)
    }
    client.removeListener('login', this.afterAuthentication)
    client.removeListener('logout', this.afterLogout)
  }

  componentWillUnmount() {
    this.stopHandlingDeeplinks()
    this.stopListeningToClient()
    this.unmounted = true
  }

  update() {
    this.forceUpdate()
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

  handleDeepLink(url) {
    url = url || deeplink.get()
    deeplink.clear()
    if (!url) {
      return
    }
    const path = url.replace(this.props.protocol, '')
    this.props.history.replace('/' + path)
    if (path.startsWith('auth')) {
      this.handleAuth()
    }
  }

  async handleAuth() {
    const { client, history } = this.props
    try {
      const currentLocation = history.getCurrentLocation()
      const { access_code, state, cozy_url } = currentLocation.query
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
      children
    } = this.props

    if (this.state.isLoggingInViaOnboarding) {
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

  async afterLogout() {
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
  logoutPath: '/'
}

MobileRouter.propTypes = {
  history: PropTypes.object.isRequired,

  appRoutes: PropTypes.node,
  children: PropTypes.node,
  appTitle: PropTypes.string.isRequired,
  appIcon: PropTypes.string.isRequired,

  onAuthenticated: PropTypes.func,
  onLogout: PropTypes.func,
  onException: PropTypes.func.isRequired,

  /** CozyClient instance, should be provided via <CozyProvider /> */
  client: PropTypes.object.isRequired,

  /** After login, where do we go */
  loginPath: PropTypes.string,
  /** After logout, where do we go */
  logoutPath: PropTypes.string
}

export const DumbMobileRouter = MobileRouter

export default withClient(MobileRouter)
