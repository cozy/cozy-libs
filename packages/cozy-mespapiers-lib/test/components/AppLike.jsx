// eslint-disable-next-line import/no-extraneous-dependencies
import FileSharingProvider from 'components/Contexts/FileSharingProvider'
import { createHashHistory } from 'history'
import React from 'react'
import { HashRouter } from 'react-router-dom'

import { CozyProvider, createMockClient } from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ErrorProvider } from '../../src/components/Contexts/ErrorProvider'
import { ModalProvider } from '../../src/components/Contexts/ModalProvider'
import { MultiSelectionProvider } from '../../src/components/Contexts/MultiSelectionProvider'
import PapersCreatedProvider from '../../src/components/Contexts/PapersCreatedProvider'
import { PapersDefinitionsProvider } from '../../src/components/Contexts/PapersDefinitionsProvider'
import { PaywallProvider } from '../../src/components/Contexts/PaywallProvider'
import { ScannerI18nProvider } from '../../src/components/Contexts/ScannerI18nProvider'
import SearchProvider from '../../src/components/Contexts/SearchProvider'
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
      <FileSharingProvider>
        <CozyProvider client={client || mockClient}>
          <I18n dictRequire={() => enLocale} lang="en">
            <PapersCreatedProvider>
              <ErrorProvider>
                <PaywallProvider>
                  <ScannerI18nProvider lang="en">
                    <SearchProvider
                      doctypes={[FILES_DOCTYPE, CONTACTS_DOCTYPE]}
                    >
                      <CozyTheme>
                        <BreakpointsProvider>
                          <AlertProvider>
                            <HashRouter history={hashHistory}>
                              <MultiSelectionProvider>
                                <PapersDefinitionsProvider>
                                  <ModalProvider>{children}</ModalProvider>
                                </PapersDefinitionsProvider>
                              </MultiSelectionProvider>
                            </HashRouter>
                          </AlertProvider>
                        </BreakpointsProvider>
                      </CozyTheme>
                    </SearchProvider>
                  </ScannerI18nProvider>
                </PaywallProvider>
              </ErrorProvider>
            </PapersCreatedProvider>
          </I18n>
        </CozyProvider>
      </FileSharingProvider>
    </WebviewIntentProvider>
  )
}

export default AppLike
