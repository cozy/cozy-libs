import React, { useState, useEffect } from 'react'
import { UPDATE_EVENT } from './ConnectionFlow'

export const useFlowState = flow => {
  const [flowState, setFlowState] = useState(flow.getState())
  useEffect(() => {
    const handleFlowUpdate = () => setFlowState(flow.getState())
    flow.on(UPDATE_EVENT, handleFlowUpdate)
    return () => {
      flow.removeListener(UPDATE_EVENT, handleFlowUpdate)
    }
  }, [flow, setFlowState])

  return flowState
}

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
  const Wrapper = props => {
    const flowState = useFlowState(props[flowPropName])
    return <Wrapped {...props} {...{ [statePropName]: flowState }} />
  }
  Wrapper.displayName = `withConnectionFlow(${Wrapped.displayName ||
    Wrapped.name})`
  return Wrapper
}

export default withConnectionFlow
