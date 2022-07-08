import React, { createContext, useState, useCallback } from 'react'

import { useModal } from '../Hooks/useModal'

const ModalContext = createContext()

const ModalProvider = ({ children }) => {
  const [modalStack, setModalStack] = useState([])
  const pushModal = useCallback(modal => {
    setModalStack(prev => [...prev, modal])
  }, [])
  const popModal = useCallback(() => {
    modalStack.pop()
    setModalStack([...modalStack])
  }, [modalStack])

  return (
    <ModalContext.Provider value={{ modalStack, pushModal, popModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalContext

export { ModalProvider }

export const ModalStack = () => {
  const { modalStack } = useModal()

  if (modalStack.length === 0) return null
  else return modalStack[modalStack.length - 1]
}
