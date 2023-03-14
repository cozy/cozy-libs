import PropTypes from 'prop-types'
import React, { useContext } from 'react'

import withAdaptiveRouter from './hoc/withRouter'

export const MountPointContext = React.createContext()

export class RawMountPointProvider extends React.Component {
  constructor(props) {
    super(props)

    this.pushHistory = this.pushHistory.bind(this)
    this.replaceHistory = this.replaceHistory.bind(this)

    this.state = {
      baseRoute: props.baseRoute || '/',
      pushHistory: this.pushHistory,
      replaceHistory: this.replaceHistory,
      location: props.location
    }
  }

  pushHistory(route) {
    this.props.historyAction(route, 'push')
  }

  replaceHistory(route) {
    this.props.historyAction(route, 'replace')
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

export const withMountPointProps = BaseComponent => {
  const Component = props => {
    const { pushHistory, replaceHistory, location } =
      useContext(MountPointContext)

    return (
      <BaseComponent
        pushHistory={pushHistory}
        replaceHistory={replaceHistory}
        location={location}
        {...props}
      />
    )
  }

  Component.displayName = `withMountPointProps(${
    BaseComponent.displayName || BaseComponent.name
  })`

  return Component
}

export const MountPointProvider = withAdaptiveRouter(RawMountPointProvider)
