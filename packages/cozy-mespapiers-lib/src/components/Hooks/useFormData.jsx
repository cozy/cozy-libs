import { useContext } from 'react'

import FormDataContext from '../Contexts/FormDataProvider'

/**
 * @returns {import('../../types').FormDataContext}
 */
export const useFormData = () => {
  const formDataContext = useContext(FormDataContext)
  if (!formDataContext) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return formDataContext
}
