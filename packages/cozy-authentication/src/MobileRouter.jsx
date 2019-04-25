import React, { Component } from 'react'
import { Router, withRouter } from 'react-router'
import Proptypes from 'prop-types'

import { withClient } from 'cozy-client'

import Authentication from './Authentication'
import Revoked from './Revoked'
import deeplink from './utils/deeplink'

// Even if the component is not yet mounted, we save
// the deeplink
window.handleOpenURL = deeplink.save

const clientUpdateEvents = ['login', 'logout', 'revoked', 'unrevoked']

export class MobileRouter extends Component {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.handleDeepLink = this.handleDeepLink.bind(this)
  }

  componentDidMount () {
    this.startListeningToClient()
    this.startHandlingDeeplinks()
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
      await doOnboardingLogin(client, cozy_url, state, access_code)
      this.afterAuthentication()
    } catch (error) {
      await client.logout()
    }
  }

  render() {
    const {
      history,
      onAuthenticated,
      onLogout,
      appIcon,
      appTitle,
      appRoutes,
      onException,
      client,
      children
    } = this.props

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
          onLogout={this.handleLogout}
        />
      )
    } else {
      return <Router history={history}>{appRoutes}</Router>

  async handleLogBackIn = () => {
    const { client } = this.props
    await client.stackClient.unregister().catch(() => {})
    await client.stackClient.register(client.uri)
  }

  afterAuthentication = async () => {
    this.props.history.replace('/')
  }

  afterLogout = async () => {
    this.props.history.replace('/')
  }

  handleLogout = async () => {
    const { client } = this.props
    await client.logout()
    if (this.props.onLogout) {
      this.props.onLogout()
    }
  }
}

MobileRouter.defaultProps = {
  onException: e => {
    console.warn('exeception', e) //eslint-disable-line no-console
  }
}

MobileRouter.propTypes = {
  onboarding: onboardingPropTypes.isRequired,
  onboardingInformations: onboardingInformationsPropTypes.isRequired,
  history: Proptypes.object.isRequired,
  appRoutes: Proptypes.object.isRequired,
  isAuthenticated: Proptypes.bool.isRequired,
  isRevoked: Proptypes.bool.isRequired,
  onAuthenticated: Proptypes.func.isRequired,
  onLogout: Proptypes.func.isRequired,
  appIcon: Proptypes.string.isRequired,
  onException: Proptypes.func.isRequired
}

export default withClient(MobileRouter)
