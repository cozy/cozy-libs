import React, { createContext, useState } from 'react'
const FormDataContext = createContext()

const FormDataProvider = ({ children }) => {
  /**
   * @type {[import('../../types').FormData, import('../../types').FormDataSetter]}
   */
  const [formData, setFormData] = useState({
    metadata: {},
    data: [],
    contacts: []
  })

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  )
}

export default FormDataContext

export { FormDataProvider }
