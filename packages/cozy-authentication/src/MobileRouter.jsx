import React, { Component } from 'react'
import { Router, withRouter } from 'react-router'
import Proptypes from 'prop-types'
import Authentication from './Authentication'
import Revoked from './Revoked'
import {
  secretExchange,
  getAccessToken,
  readLocalData,
  clearLocalData,
  checkIfOnboardingLogin,
  addProtocolToURL
} from './utils/onboarding'
import {
  onboardingInformationsPropTypes,
  onboardingPropTypes
} from './OnboardingPropTypes'

export class MobileRouter extends Component {
  async doOnboardingLogin(receivedState, code, instanceDomain, history) {
    const { state: localState, secret: localSecret } = await readLocalData()

    try {
      if (localState !== receivedState) {
        throw new Error('States are not equals')
      }

      const clientInfo = await secretExchange(
        localSecret,
        instanceDomain,
        this.props.client
      )

      const {
        onboarding_secret,
        onboarding_state,
        client_id,
        client_secret
      } = clientInfo

      if (
        !(localSecret === onboarding_secret && localState === onboarding_state)
      )
        throw new Error('exchanged informations are not good')

      const token = await getAccessToken(
        { client_id, client_secret },
        instanceDomain,
        code,
        this.props.client
      )

      await this.props.onAuthenticated({
        url: addProtocolToURL(instanceDomain),
        token,
        clientInfo,
        router: history
      })
    } catch (error) {
      this.props.onLogout()
    } finally {
      await clearLocalData()
    }
  }

  render() {
    const {
      history,
      appRoutes,
      isAuthenticated,
      isRevoked,
      onAuthenticated,
      onLogout,
      appIcon,
      onboarding,
      onboardingInformations,
      onException
    } = this.props

    if (!isAuthenticated) {
      if (checkIfOnboardingLogin(onboardingInformations)) {
        /* We need to hide() the ViewController since the ViewController is still active
        when the application cames from background (specialy on iOS)
        */
        if (window.SafariViewController) window.SafariViewController.hide()
        const { code, state, cozy_url } = onboardingInformations
        this.doOnboardingLogin(state, code, cozy_url, history)
        //we return null since the previous method is async
        return null
      } else {
        return (
          <Authentication
            router={history}
            onComplete={onAuthenticated}
            onException={onException}
            appIcon={appIcon}
            onboarding={onboarding}
          />
        )
      }
    } else if (isRevoked) {
      return (
        <Revoked
          router={history}
          onLogBackIn={onAuthenticated}
          onLogout={onLogout}
        />
      )
    } else {
      return <Router history={history}>{appRoutes}</Router>
    }
  }
}

MobileRouter.defaultProps = {
  onException: e => {
    console.error('MobileRouter: ', e) // eslint-disable-line no-console
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

export default withRouter(MobileRouter)
