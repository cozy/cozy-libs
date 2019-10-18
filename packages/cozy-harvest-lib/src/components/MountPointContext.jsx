import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

const MountPointContext = React.createContext()

export class RawMountPointProvider extends React.Component {
  constructor(props) {
    super(props)

    this.pushHistory = this.pushHistory.bind(this)

    this.state = {
      baseRoute: props.baseRoute || '/',
      pushHistory: this.pushHistory
    }
  }

  pushHistory(route) {
    const { history } = this.props
    const { baseRoute } = this.state
    const segments = baseRoute
      .split('/')
      .concat(route.split('/'))
      .filter(Boolean)
    history.push(`/${segments.join('/')}`)
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

const withMountPointPushHistory = BaseComponent => {
  const Component = props => {
    const { pushHistory } = useContext(MountPointContext)
    return <BaseComponent pushHistory={pushHistory} {...props} />
  }

  Component.displayName = `const withMountPointPushHistory(${BaseComponent.displayName ||
    BaseComponent.name})`

  return Component
}

const MountPointProvider = withRouter(RawMountPointProvider)
export { MountPointContext, MountPointProvider, withMountPointPushHistory }
