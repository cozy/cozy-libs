import React, { createContext, useContext } from 'react'

const DatacardOptionsContext = createContext()

export const useDatacardOptions = () => {
  return useContext(DatacardOptionsContext)
}

/**
 * Sets datacard options for tree below
 */
export const DatacardOptions = ({ children, options }) => {
  return (
    <DatacardOptionsContext.Provider value={options}>
      {children}
    </DatacardOptionsContext.Provider>
  )
}

export default DatacardOptionsContext
