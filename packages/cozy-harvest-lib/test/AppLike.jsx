import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import CozyClient, { CozyProvider as CozyClientProvider } from 'cozy-client'
import { useCozyDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import DialogContext from '../src/components/DialogContext'
import enLocale from '../src/locales/en.json'

const defaultClient = new CozyClient()
defaultClient.ensureStore()

const AppLike = ({
  client: clientOption,
  store: storeOption,
  locale,
  children
}) => {
  const client = clientOption || defaultClient
  const store = storeOption || defaultClient.store

  return (
    <CozyClientProvider client={client}>
      <BreakpointsProvider>
        <DialogContextApp>
          <I18n lang="en" dictRequire={() => locale || enLocale}>
            <ReduxProvider store={store}>{children}</ReduxProvider>
          </I18n>
        </DialogContextApp>
      </BreakpointsProvider>
    </CozyClientProvider>
  )
}

const DialogContextApp = ({ children }) => {
  const dialogContext = useCozyDialog({
    size: 'l',
    open: true,
    onClose: null,
    disableTitleAutoPadding: true
  })
  return (
    <DialogContext.Provider value={dialogContext}>
      {children}
    </DialogContext.Provider>
  )
}
export default AppLike
