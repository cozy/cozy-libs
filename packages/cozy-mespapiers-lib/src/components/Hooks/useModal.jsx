import { useContext } from 'react'

import ModalContext from '../Contexts/ModalProvider'

export const useModal = () => {
  const modalContext = useContext(ModalContext)
  if (!modalContext) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return modalContext
}
