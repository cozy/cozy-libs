import React, { createContext, useContext } from 'react'

const DatacardOptionsContext = createContext()

export const useDatacardOptions = () => useContext(DatacardOptionsContext)

/**
 * Sets datacard options for tree below
 */
export var DatacardOptions = ({ children, options }) => (
  <DatacardOptionsContext.Provider value={options}>
    {children}
  </DatacardOptionsContext.Provider>
)

export default DatacardOptionsContext
