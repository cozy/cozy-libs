import { createContext, useContext } from 'react'

const DialogContext = createContext({})
export const useDialogContext = () => useContext(DialogContext)
export default DialogContext
