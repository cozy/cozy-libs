import { createContext, useContext } from 'react'

const DialogContext = createContext({})
export const useDialogContext = () => {
  return useContext(DialogContext)
}
export default DialogContext
