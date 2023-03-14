import flow from 'lodash/flow'
import React from 'react'

import { getDisplayName } from './utils'

// should be `react-router-dom` when `react-router` removed from peerDep
export const isRouterV6 = !require('react-router').withRouter

export const historyAction = (props, historyOrNavigate) => (route, method) => {
  const { baseRoute } = props

  if (isRouterV6) {
    // in react-router v6 we don't want to use "/"" as first character of a route
    // otherwise the path would be absolute and not relative
    const path = route[0] === '/' ? route.substr(1) : route
    return historyOrNavigate(path, { replace: method === 'replace' })
  }

  const splitBaseRoute = baseRoute?.split('/') || []
  const segments = '/'.concat(
    splitBaseRoute.concat(route.split('/')).filter(Boolean).join('/')
  )

  return historyOrNavigate[method](segments)
}

const withRouter = WrappedComponent => {
  function Component(props) {
    const { location: legacyLocation, history: legacyHistory } = props

    const adaptiveLocation = isRouterV6
      ? require('react-router-dom').useLocation()
      : legacyLocation

    const historyOrNavigate = isRouterV6
      ? require('react-router-dom').useNavigate()
      : require('react-router-dom').useHistory?.() || legacyHistory

    return (
      <WrappedComponent
        {...props}
        historyAction={historyAction(props, historyOrNavigate)}
        location={adaptiveLocation}
      />
    )
  }

  Component.displayName = 'withRouter(' + getDisplayName(WrappedComponent) + ')'
  Component.propTypes = {
    ...WrappedComponent.propTypes
  }
  Component.WrappedComponent = WrappedComponent

  return Component
}

/**
 * HOC to wrap with a router version older than 6 methods if relevant
 */
const withAdaptiveRouter = WrappedComponent => {
  // We use `react-router` here and not `react-router-dom` to ensure
  // backward compatibility with Banks which uses `react-router` v3 for the moment.
  // When Banks router migration is done to v6, we can replace with `react-router-dom`.
  // There will then be a problem with the tests, we will have to correct them or add this to the jest configuration:
  // '^react-router-dom$': '<rootDir>/node_modules/react-router/lib/index.js'
  const withLegacyRouter = require('react-router').withRouter // withRouter is only available in `react-router < 6`

  const ComponentV4orV6 = withLegacyRouter
    ? flow(withRouter, withLegacyRouter)(WrappedComponent)
    : withRouter(WrappedComponent)

  function Component(props) {
    return <ComponentV4orV6 {...props} />
  }

  Component.displayName = `withAdaptiveRouter(${
    WrappedComponent.displayName || WrappedComponent.name
  })`

  return Component
}

export default withAdaptiveRouter
