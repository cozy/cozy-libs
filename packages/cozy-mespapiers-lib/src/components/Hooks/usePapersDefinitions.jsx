import { useContext } from 'react'

import PapersDefinitionsContext from '../Contexts/PapersDefinitionsProvider'

export const usePapersDefinitions = () => {
  const papersDefinitionsContext = useContext(PapersDefinitionsContext)
  if (!papersDefinitionsContext) {
    throw new Error(
      'usePapersDefinitions must be used within a PapersDefinitionsProvider'
    )
  }
  return papersDefinitionsContext
}
