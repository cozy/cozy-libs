import React from 'react'

import { CozyProvider, createMockClient } from 'cozy-client'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

import langEn from '../locales/en.json'

const AppLike = ({ children, client }) => (
  <CozyProvider client={client || createMockClient({})}>
    <BreakpointsProvider>
      <CozyTheme>
        <I18n lang="en" dictRequire={() => langEn}>
          <AlertProvider>{children}</AlertProvider>
        </I18n>
      </CozyTheme>
    </BreakpointsProvider>
  </CozyProvider>
)

export default AppLike
