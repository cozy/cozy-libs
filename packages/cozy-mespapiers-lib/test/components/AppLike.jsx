// eslint-disable-next-line import/no-extraneous-dependencies
import { createHashHistory } from 'history'
import React from 'react'
import { HashRouter } from 'react-router-dom'

import { CozyProvider, createMockClient } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ErrorProvider } from '../../src/components/Contexts/ErrorProvider'
import { ModalProvider } from '../../src/components/Contexts/ModalProvider'
import { MultiSelectionProvider } from '../../src/components/Contexts/MultiSelectionProvider'
import { PapersDefinitionsProvider } from '../../src/components/Contexts/PapersDefinitionsProvider'
import { PaywallProvider } from '../../src/components/Contexts/PaywallProvider'
import { ScannerI18nProvider } from '../../src/components/Contexts/ScannerI18nProvider'
import SearchProvider from '../../src/components/Contexts/SearchProvider'
import { StepperDialogProvider } from '../../src/components/Contexts/StepperDialogProvider'
import { FILES_DOCTYPE, CONTACTS_DOCTYPE } from '../../src/doctypes'
import enLocale from '../../src/locales/en.json'

jest.mock('cozy-client/dist/models/document/documentTypeData', () => ({
  themes: [{}]
}))

const mockClient = createMockClient({})
mockClient.plugins.realtime = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn()
}

const AppLike = ({ children, client, history }) => {
  const hashHistory = history || createHashHistory()
  return (
    <WebviewIntentProvider>
      <CozyProvider client={client || mockClient}>
        <I18n dictRequire={() => enLocale} lang="en">
          <ErrorProvider>
            <PaywallProvider>
              <MultiSelectionProvider>
                <ScannerI18nProvider lang="en">
                  <SearchProvider doctypes={[FILES_DOCTYPE, CONTACTS_DOCTYPE]}>
                    <MuiCozyTheme>
                      <BreakpointsProvider>
                        <HashRouter history={hashHistory}>
                          <PapersDefinitionsProvider>
                            <StepperDialogProvider>
                              <ModalProvider>{children}</ModalProvider>
                            </StepperDialogProvider>
                          </PapersDefinitionsProvider>
                        </HashRouter>
                      </BreakpointsProvider>
                    </MuiCozyTheme>
                  </SearchProvider>
                </ScannerI18nProvider>
              </MultiSelectionProvider>
            </PaywallProvider>
          </ErrorProvider>
        </I18n>
      </CozyProvider>
    </WebviewIntentProvider>
  )
}

export default AppLike
