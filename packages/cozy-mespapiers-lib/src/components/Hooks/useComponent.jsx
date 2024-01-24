import { useContext } from 'react'

import ComponentContext from '../Contexts/ComponentProvider'

export const useComponent = () => {
  const componentContext = useContext(ComponentContext)
  if (!componentContext) {
    throw new Error('useComponent must be used within a ComponentProvider')
  }
  return componentContext
}
