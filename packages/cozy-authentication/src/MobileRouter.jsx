import React, { Component } from 'react'
import { Router, withRouter } from 'react-router'
import Proptypes from 'prop-types'
import Authentication from './Authentication'
import Revoked from './Revoked'
export class MobileRouter extends Component {





    } catch (error) {
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

export default withRouter(MobileRouter)
