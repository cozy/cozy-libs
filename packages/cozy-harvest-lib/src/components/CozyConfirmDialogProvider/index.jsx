import React, { createContext, useContext, useState } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'

export const CozyConfirmDialogContext = createContext()

let currentDialogId = 0

export const useCozyConfirmDialog = () => {
  const context = useContext(CozyConfirmDialogContext)
  if (!context) {
    throw new Error(
      'Cannot use useCozyConfirmDialog without CozyConfirmDialogProvider. The component must a CozyConfirmDialogProvider above it.'
    )
  }
  return context
}

export const CozyConfirmDialogProvider = React.memo(props => {
  const [dialogs, setDialogs] = useState([])
  const { children } = props

  const onClose = dialogId => {
    dialogs.find(dialog => dialog.id === dialogId).callback()
    setDialogs(prevDialogs =>
      prevDialogs.filter(dialog => dialog.id !== dialogId)
    )
  }

  const context = {
    showDialog: ({ title, closeLabel, description }) => {
      return new Promise(resolve => {
        setDialogs(prevDialogs => {
          return [
            ...prevDialogs,
            {
              id: currentDialogId++,
              title,
              closeLabel,
              description,
              callback: resolve
            }
          ]
        })
      })
    }
  }

  return (
    <CozyConfirmDialogContext.Provider value={context}>
      {dialogs &&
        dialogs.map(dialog => {
          return (
            <ConfirmDialog
              open
              key={dialog.id}
              title={dialog.title}
              content={dialog.description}
              actions={
                <Button
                  label={dialog.closeLabel}
                  aria-label="Close dialog"
                  onClick={() => onClose(dialog.id)}
                />
              }
              onClose={() => onClose(dialog.id)}
            />
          )
        })}
      {children}
    </CozyConfirmDialogContext.Provider>
  )
})

CozyConfirmDialogProvider.displayName = 'CozyConfirmDialogProvider'
