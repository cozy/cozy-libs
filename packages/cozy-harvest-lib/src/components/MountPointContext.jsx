import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

const MountPointContext = React.createContext()

export class RawMountPointProvider extends React.Component {
  constructor(props) {
    super(props)

    this.pushHistory = this.pushHistory.bind(this)
    this.replaceHistory = this.replaceHistory.bind(this)

    this.state = {
      baseRoute: props.baseRoute || '/',
      pushHistory: this.pushHistory,
      replaceHistory: this.replaceHistory
    }
  }

  historyAction(route, method) {
    const { history } = this.props
    const { baseRoute } = this.state
    const segments = '/'.concat(
      baseRoute.split('/').concat(route.split('/')).filter(Boolean).join('/')
    )

    history[method](segments)
  }

  pushHistory(route) {
    this.historyAction(route, 'push')
  }

  replaceHistory(route) {
    this.historyAction(route, 'replace')
  }

  render() {
    return (
      <MountPointContext.Provider value={this.state}>
        {this.props.children}
      </MountPointContext.Provider>
    )
  }
}

RawMountPointProvider.propTypes = {
  baseRoute: PropTypes.string,
  history: PropTypes.object
}

const withMountPointHistory = BaseComponent => {
  const Component = props => {
    const { pushHistory, replaceHistory } = useContext(MountPointContext)

    return (
      <BaseComponent
        pushHistory={pushHistory}
        replaceHistory={replaceHistory}
        {...props}
      />
    )
  }

  Component.displayName = `withMountPointHistory(${
    BaseComponent.displayName || BaseComponent.name
  })`

  return Component
}

const MountPointProvider = withRouter(RawMountPointProvider)
export { MountPointContext, MountPointProvider, withMountPointHistory }
