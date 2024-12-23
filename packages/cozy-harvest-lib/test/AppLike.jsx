import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import {
  CozyProvider as CozyClientProvider,
  createMockClient
} from 'cozy-client'
import { useCozyDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import DialogContext from '../src/components/DialogContext'
import enLocale from '../src/locales/en.json'

const defaultClient = createMockClient({})

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
      <CozyTheme>
        <BreakpointsProvider>
          <AlertProvider>
            <DialogContextApp>
              <I18n lang="en" dictRequire={() => locale || enLocale}>
                <ReduxProvider store={store}>{children}</ReduxProvider>
              </I18n>
            </DialogContextApp>
          </AlertProvider>
        </BreakpointsProvider>
      </CozyTheme>
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
