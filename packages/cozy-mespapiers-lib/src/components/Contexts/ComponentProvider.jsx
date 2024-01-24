import React, { createContext, useState, useCallback } from 'react'

import { useComponent } from '../Hooks/useComponent'

const ComponentContext = createContext()

const ComponentProvider = ({ children }) => {
  const [componentStack, setComponentStack] = useState([])
  const pushComponent = useCallback(component => {
    setComponentStack(prev => [...prev, component])
  }, [])
  const popComponent = useCallback(() => {
    componentStack.pop()
    setComponentStack([...componentStack])
  }, [componentStack])

  return (
    <ComponentContext.Provider
      value={{ componentStack, pushComponent, popComponent }}
    >
      {children}
    </ComponentContext.Provider>
  )
}

export default ComponentContext

export { ComponentProvider }

export const ComponentStack = () => {
  const { componentStack } = useComponent()

  if (componentStack.length === 0) return null
  else return componentStack[componentStack.length - 1]
}
