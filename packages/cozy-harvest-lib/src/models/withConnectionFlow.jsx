import React  from 'react'
import { UPDATE_EVENT } from './ConnectionFlow'

/**
 * HOC to connect a ConnectionFlow state to a prop
 *
 * - Expects to find the ConnectionFlow insttance inside props[flowPropName]
 * - With every update of the ConnectionFlow instance, the wrapped component will be
 * re-rendered with a [statePropName] prop.
 */
const withConnectionFlow = ({
  flowPropName = 'flow',
  statePropName = 'flowState'
} = {}) => Wrapped => {
  class Wrapper extends React.Component {
    constructor(props, context) {
      super(props, context)
      const flow = this.props[flowPropName]
      this.state = {
        flowState: flow.getState()
      }
      this.handleFlowUpdate = this.handleFlowUpdate.bind(this)
    }

    componentDidMount() {
      const flow = this.props[flowPropName]
      flow.on(UPDATE_EVENT, this.handleFlowUpdate)
    }

    componentWillUnmount() {
      const flow = this.props[flowPropName]
      flow.removeListener(UPDATE_EVENT, this.handleFlowUpdate)
    }

    handleFlowUpdate() {
      const flow = this.props[flowPropName]
      this.setState({
        flowState: flow.getState()
      })
    }

    render() {
      return <Wrapped {...this.props} {...{ [statePropName]: this.state.flowState } } />
    }
  }
  Wrapper.displayName = `withConnectionFlow(${Wrapped.displayName || Wrapped.name})`
  return Wrapper
}

export default withConnectionFlow
