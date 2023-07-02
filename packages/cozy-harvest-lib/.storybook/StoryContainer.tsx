import React, { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import CozyClient, { CozyProvider as CozyClientProvider } from 'cozy-client'
import { useCozyDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import DialogContext from '../src/components/DialogContext'
import enLocale from '../src/locales/en.json'
import { RawMountPointProvider } from '../src/components/MountPointContext'
import { realtimeMock } from './__mocks__/cozy-realtime'
import { AccountModalFixtures } from './fixtures/AccountModal.fixtures'


export const storybookClient = new CozyClient()
storybookClient.ensureStore()
storybookClient.plugins.realtime = realtimeMock
storybookClient.query = () => Promise.resolve({data: AccountModalFixtures.accountsAndTriggers[0].account})


export const StoryContainer = ({ children }: {children: ReactNode}) => {
  return (
    <CozyClientProvider client={storybookClient}>
      <CozyTheme>
        <BreakpointsProvider>
          <DialogContextApp>
            <I18n lang="en" dictRequire={() => enLocale}>
              <ReduxProvider store={storybookClient.store}>
                <RawMountPointProvider>
                  <div style={{position: "relative"}}>{children}</div>
                </RawMountPointProvider>
              </ReduxProvider>
            </I18n>
          </DialogContextApp>
        </BreakpointsProvider>
      </CozyTheme>
    </CozyClientProvider>
  )
}

const DialogContextApp = ({ children }: {children: ReactNode}) => {
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


