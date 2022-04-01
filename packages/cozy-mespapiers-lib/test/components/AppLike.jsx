import React from 'react'
import { HashRouter } from 'react-router-dom'
import { createHashHistory } from 'history'

import { CozyProvider, createMockClient } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { WebviewIntentProvider } from 'cozy-intent'

import { StepperDialogProvider } from 'src/components/Contexts/StepperDialogProvider'
import { ModalProvider } from 'src/components/Contexts/ModalProvider'
import { ScannerI18nProvider } from 'src/components/Contexts/ScannerI18nProvider'
import { PapersDefinitionsProvider } from 'src/components/Contexts/PapersDefinitionsProvider'
import enLocale from 'src/locales/en.json'

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
        <I18n dictRequire={() => enLocale} lang={'en'}>
          <ScannerI18nProvider lang={'en'}>
            <BreakpointsProvider>
              <PapersDefinitionsProvider>
                <StepperDialogProvider>
                  <ModalProvider>
                    <HashRouter history={hashHistory}>{children}</HashRouter>
                  </ModalProvider>
                </StepperDialogProvider>
              </PapersDefinitionsProvider>
            </BreakpointsProvider>
          </ScannerI18nProvider>
        </I18n>
      </CozyProvider>
    </WebviewIntentProvider>
  )
}

export default AppLike
