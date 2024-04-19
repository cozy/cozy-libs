/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'

import React, { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import CozyClient, { CozyProvider as CozyClientProvider } from 'cozy-client'
import { useCozyDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import DialogContext from '../src/components/DialogContext'
import enLocale from '../src/locales/en.json'

const defaultClient = new CozyClient()
defaultClient.ensureStore()

export const StoryContainer = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  return (
    <CozyClientProvider client={defaultClient}>
      <CozyTheme>
        <BreakpointsProvider>
          <DialogContextApp>
            <I18n lang="en" dictRequire={() => enLocale}>
              <ReduxProvider store={defaultClient.store}>
                <div style={{ position: 'relative' }}>{children}</div>
              </ReduxProvider>
            </I18n>
          </DialogContextApp>
        </BreakpointsProvider>
      </CozyTheme>
    </CozyClientProvider>
  )
}

const DialogContextApp = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
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
